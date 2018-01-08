import React, { Component } from "react"
import PropTypes from "prop-types"
import Img from "gatsby-image"
import Helmet from "react-helmet"
import { css } from "glamor"

import config from "../data/SiteConfig";
import { rhythm } from "../utils/typography"
import Disqus from "../components/Disqus"
import PostIcons from "../components/PostIcons"
import PostFooter from "../components/PostFooter"
import SocialShare from "../components/SocialShare"

let boxedContent = css({
  maxWidth: 650,
  margin: `2em auto`,
  position: `relative`,
  padding: `0 1em`,
  '& img': {
    width: `100%`,
    objectFit: `cover`
  },
  '& p, & ol, & ul': {
    padding: `0 2em`
  },
  '& .gallery-row': {
    display: `inline-flex`
  },
  '& .tiled-gallery': {
    display: `flex`,
    justifyContent: `center`
  }
})

class PostTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: true
    };
    this.handleResize = this.handleResize.bind(this);
  }

  unWrapNextImageIfExists(){
    // select element to unwrap
    var el = document.querySelector('.content-container p img');
    if(!el)
      return ;
    el = el.parentNode;
    // get the element's parent node
    var parent = el.parentNode;

    // move all children out of the element
    while (el.firstChild) parent.insertBefore(el.firstChild, el);

    // remove the empty element
    parent.removeChild(el); 

    this.unWrapNextImageIfExists();
  }
  componentDidMount()
  {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);

    this.unWrapNextImageIfExists();
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize() {
    if (window.innerWidth >= 640) {
      this.setState({ mobile: false });
    } else {
      this.setState({ mobile: true });
    }
  }

  render() {
    const post = this.props.data.wordpressPost
    const { pathId } = this.props.pathContext;
    const { slug } = post;
    if (!post.id) {
      post.id = pathId;
    }
    return (
      <div css={{ position: `relative` }}>
        <Helmet>
          <title>{`${post.title} - ${config.siteTitle}`}</title>
          <link rel="canonical" href={`${config.siteUrl}${post.id}`} />
        </Helmet>
        
        {post.featured_media && <Img css={{ height: `60vh` }} sizes={post.featured_media.localFile.childImageSharp.sizes}/>}
        <div css={{ background: `linear-gradient(rgba(255,255,255,0) 50%,rgba(255,255,255,1) 95%)`, width: `100%`, height: `60vh`, position: `absolute`, top: 0, left: 0 }}></div>
      
        <div {...boxedContent} css={{ display: `flex`, flexDirection: `column`, justifyContent: `center`, alignItems: `center`, marginTop: `-4em !important` }}>
          <h1 css={{color: `rgb(133,133,133)`, textTransform: `uppercase`, textAlign: `center`}} dangerouslySetInnerHTML={{ __html: post.title }} />
          <PostIcons node={post} css={{ marginBottom: rhythm(1 / 2), textAlign: `center` }} />
        </div>
        <div {...boxedContent} className="content-container" dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.acf &&
          post.acf.page_builder_post &&
          post.acf.page_builder_post.map((layout, i) => {
            if (layout.__typename === `WordPressAcf_image_gallery`) {
              return (
                <div key={`${i} image-gallery`}>
                  <h2>ACF Image Gallery</h2>
                  {layout.pictures.map(({ picture }) => {
                    const img = picture.localFile.childImageSharp.sizes
                    return (
                      <Img
                        css={{ marginBottom: rhythm(1) }}
                        key={img.src}
                        sizes={img}
                      />
                    )
                  })}
                </div>
              )
            }
            if (layout.__typename === `WordPressAcf_post_photo`) {
              const img = layout.photo.localFile.childImageSharp.sizes
              return (
                <div key={`${i}-photo`}>
                  <h2>ACF Post Photo</h2>
                  <Img
                    css={{ marginBottom: rhythm(1) }}
                    src={img.src}
                    sizes={img}
                  />
                </div>
              )
            }
            return null
          })}
          <div {...boxedContent}>
            <PostFooter node={post} />
            <SocialShare
                postPath={slug}
                postNode={post}
                mobile={this.state.mobile}
              />
            <Disqus postNode={post} />
          </div>
      </div>
    )
  }
}
//<img src={post.image.sizes.thumbnail} />

PostTemplate.propTypes = {
  data: PropTypes.object.isRequired,
  edges: PropTypes.array,
}

export default PostTemplate

export const pageQuery = graphql`
  query currentPostQuery($id: String!) {
    wordpressPost(id: { eq: $id }) {
      title
      slug
      content
      ...PostIcons
      ...PostFooter
      featured_media {
        localFile {
          childImageSharp {
            sizes(
              maxWidth: 800
              quality: 90
            ) {
              ...GatsbyImageSharpSizes_withWebp_noBase64
            }
          }
        }
      }
    }
    site {
      siteMetadata {
        title
        subtitle
      }
    }
  }
`
