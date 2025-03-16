"use strict";(self.webpackChunkrio_docs=self.webpackChunkrio_docs||[]).push([[7643],{8518:(e,t,r)=>{r.r(t),r.d(t,{default:()=>A});r(6540);var n=r(4164),a=r(797),s=r(8207),l=r(204),o=r(569),i=r(539),c=r(1865),d=r(4848);function u(e){const{metadata:t}=e,{previousPage:r,nextPage:n}=t;return(0,d.jsxs)("nav",{className:"pagination-nav","aria-label":(0,i.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[r&&(0,d.jsx)(c.A,{permalink:r,title:(0,d.jsx)(i.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),n&&(0,d.jsx)(c.A,{permalink:n,title:(0,d.jsx)(i.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}var m=r(7220),g=r(3750),h=r(8189);function p(e){let{items:t,component:r=h.A}=e;return(0,d.jsx)(d.Fragment,{children:t.map((e=>{let{content:t}=e;return(0,d.jsx)(g.in,{content:t,children:(0,d.jsx)(r,{children:(0,d.jsx)(t,{})})},t.metadata.permalink)}))})}var x=r(7143);function j(e){const t=(0,g.kJ)(e);return(0,d.jsx)(x.A,{children:(0,d.jsx)("script",{type:"application/ld+json",children:JSON.stringify(t)})})}function f(e){const{metadata:t}=e,{siteConfig:{title:r}}=(0,a.A)(),{blogDescription:n,blogTitle:l,permalink:o}=t,i="/"===o?r:l;return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s.be,{title:i,description:n}),(0,d.jsx)(m.A,{tag:"blog_posts_list"})]})}function b(e){const{metadata:t,items:r,sidebar:n}=e;return(0,d.jsxs)(o.A,{sidebar:n,children:[(0,d.jsx)(p,{items:r}),(0,d.jsx)(u,{metadata:t})]})}function A(e){return(0,d.jsxs)(s.e3,{className:(0,n.A)(l.G.wrapper.blogPages,l.G.page.blogListPage),children:[(0,d.jsx)(f,{...e}),(0,d.jsx)(j,{...e}),(0,d.jsx)(b,{...e})]})}},8189:(e,t,r)=>{r.d(t,{A:()=>U});r(6540);var n=r(4164),a=r(3750),s=r(4848);function l(e){let{children:t,className:r}=e;return(0,s.jsx)("article",{className:r,children:t})}var o=r(6289);const i={title:"title_f1Hy"};function c(e){let{className:t}=e;const{metadata:r,isBlogPostPage:l}=(0,a.e7)(),{permalink:c,title:d}=r,u=l?"h1":"h2";return(0,s.jsx)(u,{className:(0,n.A)(i.title,t),children:l?d:(0,s.jsx)(o.A,{to:c,children:d})})}var d=r(539),u=r(1430),m=r(8569);const g={container:"container_mt6G"};function h(e){let{readingTime:t}=e;const r=function(){const{selectMessage:e}=(0,u.W)();return t=>{const r=Math.ceil(t);return e(r,(0,d.T)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:r}))}}();return(0,s.jsx)(s.Fragment,{children:r(t)})}function p(e){let{date:t,formattedDate:r}=e;return(0,s.jsx)("time",{dateTime:t,children:r})}function x(){return(0,s.jsx)(s.Fragment,{children:" \xb7 "})}function j(e){let{className:t}=e;const{metadata:r}=(0,a.e7)(),{date:l,readingTime:o}=r,i=(0,m.i)({day:"numeric",month:"long",year:"numeric",timeZone:"UTC"});return(0,s.jsxs)("div",{className:(0,n.A)(g.container,"margin-vert--md",t),children:[(0,s.jsx)(p,{date:l,formattedDate:(c=l,i.format(new Date(c)))}),void 0!==o&&(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(x,{}),(0,s.jsx)(h,{readingTime:o})]})]});var c}var f=r(5921);const b={authorCol:"authorCol_Hf19",imageOnlyAuthorRow:"imageOnlyAuthorRow_pa_O",imageOnlyAuthorCol:"imageOnlyAuthorCol_G86a"};function A(e){let{className:t}=e;const{metadata:{authors:r},assets:l}=(0,a.e7)();if(0===r.length)return null;const o=r.every((e=>{let{name:t}=e;return!t})),i=1===r.length;return(0,s.jsx)("div",{className:(0,n.A)("margin-top--md margin-bottom--sm",o?b.imageOnlyAuthorRow:"row",t),children:r.map(((e,t)=>(0,s.jsx)("div",{className:(0,n.A)(!o&&(i?"col col--12":"col col--6"),o?b.imageOnlyAuthorCol:b.authorCol),children:(0,s.jsx)(f.A,{author:{...e,imageURL:l.authorsImageUrls[t]??e.imageURL}})},t)))})}function v(){return(0,s.jsxs)("header",{children:[(0,s.jsx)(c,{}),(0,s.jsx)(j,{}),(0,s.jsx)(A,{})]})}var N=r(99),w=r(900);function T(e){let{children:t,className:r}=e;const{isBlogPostPage:l}=(0,a.e7)();return(0,s.jsx)("div",{id:l?N.LU:void 0,className:(0,n.A)("markdown",r),children:(0,s.jsx)(w.A,{children:t})})}var y=r(204),P=r(5783),k=r(6547);function F(){return(0,s.jsx)("b",{children:(0,s.jsx)(d.A,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts",children:"Read more"})})}function R(e){const{blogPostTitle:t,...r}=e;return(0,s.jsx)(o.A,{"aria-label":(0,d.T)({message:"Read more about {title}",id:"theme.blog.post.readMoreLabel",description:"The ARIA label for the link to full blog posts from excerpts"},{title:t}),...r,children:(0,s.jsx)(F,{})})}function O(){const{metadata:e,isBlogPostPage:t}=(0,a.e7)(),{tags:r,title:l,editUrl:o,hasTruncateMarker:i,lastUpdatedBy:c,lastUpdatedAt:d}=e,u=!t&&i,m=r.length>0;if(!(m||u||o))return null;if(t){const e=!!(o||d||c);return(0,s.jsxs)("footer",{className:"docusaurus-mt-lg",children:[m&&(0,s.jsx)("div",{className:(0,n.A)("row","margin-top--sm",y.G.blog.blogFooterEditMetaRow),children:(0,s.jsx)("div",{className:"col",children:(0,s.jsx)(k.A,{tags:r})})}),e&&(0,s.jsx)(P.A,{className:(0,n.A)("margin-top--sm",y.G.blog.blogFooterEditMetaRow),editUrl:o,lastUpdatedAt:d,lastUpdatedBy:c})]})}return(0,s.jsxs)("footer",{className:"row docusaurus-mt-lg",children:[m&&(0,s.jsx)("div",{className:(0,n.A)("col",{"col--9":u}),children:(0,s.jsx)(k.A,{tags:r})}),u&&(0,s.jsx)("div",{className:(0,n.A)("col text--right",{"col--3":m}),children:(0,s.jsx)(R,{blogPostTitle:l,to:e.permalink})})]})}function U(e){let{children:t,className:r}=e;const o=function(){const{isBlogPostPage:e}=(0,a.e7)();return e?void 0:"margin-bottom--xl"}();return(0,s.jsxs)(l,{className:(0,n.A)(o,r),children:[(0,s.jsx)(v,{}),(0,s.jsx)(T,{children:t}),(0,s.jsx)(O,{})]})}},1430:(e,t,r)=>{r.d(t,{W:()=>c});var n=r(6540),a=r(797);const s=["zero","one","two","few","many","other"];function l(e){return s.filter((t=>e.includes(t)))}const o={locale:"en",pluralForms:l(["one","other"]),select:e=>1===e?"one":"other"};function i(){const{i18n:{currentLocale:e}}=(0,a.A)();return(0,n.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:l(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error(`Failed to use Intl.PluralRules for locale "${e}".\nDocusaurus will fallback to the default (English) implementation.\nError: ${t.message}\n`),o}}),[e])}function c(){const e=i();return{selectMessage:(t,r)=>function(e,t,r){const n=e.split("|");if(1===n.length)return n[0];n.length>r.pluralForms.length&&console.error(`For locale=${r.locale}, a maximum of ${r.pluralForms.length} plural forms are expected (${r.pluralForms.join(",")}), but the message contains ${n.length}: ${e}`);const a=r.select(t),s=r.pluralForms.indexOf(a);return n[Math.min(s,n.length-1)]}(r,t,e)}}}}]);