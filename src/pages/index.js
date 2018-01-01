import React, { Component } from "react"
import PropTypes from "prop-types"
import Link from "gatsby-link"
import ClockIcon from "react-icons/lib/md/access-time"
import TagIcon from "react-icons/lib/md/label"
import OpenIcon from "react-icons/lib/md/folder"
import Img from "gatsby-image";
import Helmet from "react-helmet";
import { css } from "glamor";

import config from "../data/SiteConfig";
import PostIcons from "../components/PostIcons"

import { rhythm } from "../utils/typography"

let card = css({
  '& .date-field': {
    display: `none !important`
  },
  '& .category-field': {
    marginBottom: rhythm(0.5)
  }
})

class Home extends Component {
  render() {
    const data = this.props.data

    return (
      <div
        css={{
          display: `flex`,
          flexWrap: `wrap`,
        }}
        {...card}
      >
        <Helmet>
          <title>{config.siteTitle}</title>
          <link rel="canonical" href={`${config.siteUrl}`} />
        </Helmet>

        {data.allWordpressPost.edges.map(({ node }) => (
          <div 
            css={{
              border: `1px solid rgb(240,240,240)`,
              borderRadius: `4px`,
              boxShadow: `0 1px 4px rgb(240,240,240)`,
              margin: `${rhythm(0.5)}`,
              transition: `all 0.2s ease`,
              position: `relative`,
              width: `100%`,
              "@media screen and (min-width: 780px)": {
                maxWidth: `calc(50% - ${rhythm(2)})`,
                width: `calc(50% - ${rhythm(2)})`,
                margin: rhythm(1),
                ":hover": {
                  boxShadow: `0px 2px 15px rgb(220,220,220)`,
                  transition: `all 0.5s ease`
                },
              }
            }} 
            key={node.slug}
          >
            <Link to={node.slug} css={{ textDecoration: `none`, ":hover": { textDecoration: `none` } }}>
              <Img css={{ borderRadius: `4px 4px 0 0`, maxHeight: 200 }} sizes={node.featured_media.localFile.childImageSharp.sizes} />
              <div css={{ background: `linear-gradient(rgba(255,255,255,0) 50%,rgba(255,255,255,1) 95%)`, width: `100%`, height: 200, position: `absolute`, top: 0, left: 0 }}></div>
              <h5 css={{ padding: `1em 1em 0`, marginBottom: `.8rem`, marginTop: `-2em`, color: `rgb(133,133,133)`, position: `relative` }}>{node.title}</h5>
            </Link>
            <div css={{ padding: `0 1em 0.5em` }}>
              <div css={{ color: `rgb(180,180,180)` }} dangerouslySetInnerHTML={{ __html: node.excerpt }} />
              <PostIcons css={{ display: `flex`, flexWrap: `wrap` }} node={node} />
            </div>
          </div>
        ))}
      </div>
    )
  }
}

export default Home

// Set here the ID of the home page.
export const pageQuery = graphql`
  query homePageQuery {
    allWordpressPost(sort: { fields: [date], order: DESC }) {
      edges {
        node {
          title
          date(formatString: "MMM DD, YYYY")
          excerpt
          featured_media {
            localFile {
              childImageSharp {
                sizes(
                  maxWidth: 350
                  quality: 90
                ) {
                  ...GatsbyImageSharpSizes_withWebp_noBase64
                }
              }
            }
          }
          slug
          ...PostIcons
        }
      }
    }
  }
`
