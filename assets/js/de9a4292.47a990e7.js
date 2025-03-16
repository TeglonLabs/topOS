"use strict";(self.webpackChunkrio_docs=self.webpackChunkrio_docs||[]).push([[1507],{1774:(e,o,s)=>{s.r(o),s.d(o,{assets:()=>d,contentTitle:()=>l,default:()=>m,frontMatter:()=>t,metadata:()=>i,toc:()=>c});var i=s(3577),n=s(4848),r=s(8453),a=s(1341);const t={layout:"post",title:"Rio 0.0.8",date:"2023-07-03 12:34",description:"Support to Microsoft Windows, Homebrew casks and formulas, migration to Corcovado, selection improvements and increase/decrease font-size in a session.",categories:"release windows macos linux"},l=void 0,d={authorsImageUrls:[]},c=[{value:"v0.0.8: Highlights",id:"v008-highlights",level:2},{value:"Microsoft Windows",id:"microsoft-windows",level:2},{value:"Homebrew as Cask",id:"homebrew-as-cask",level:2},{value:"Homebrew as Formula",id:"homebrew-as-formula",level:2},{value:"Selection improvements and increase/decrease font-size in a session",id:"selection-improvements-and-increasedecrease-font-size-in-a-session",level:2},{value:"Migration to Corcovado",id:"migration-to-corcovado",level:2},{value:"Changelog of v0.0.8",id:"changelog-of-v008",level:2}];function h(e){const o={a:"a",code:"code",h1:"h1",h2:"h2",img:"img",li:"li",p:"p",pre:"pre",ul:"ul",...(0,r.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(o.h2,{id:"v008-highlights",children:"v0.0.8: Highlights"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsx)(o.li,{children:"Support to Microsoft Windows."}),"\n",(0,n.jsxs)(o.li,{children:["Support to Homebrew as cask ",(0,n.jsx)(o.a,{href:"https://formulae.brew.sh/cask/rio",children:"formulae.brew.sh/cask/rio"}),"."]}),"\n",(0,n.jsxs)(o.li,{children:["Support to Homebrew as formula ",(0,n.jsx)(o.a,{href:"https://formulae.brew.sh/formula/rio",children:"formulae.brew.sh/formula/rio"}),"."]}),"\n",(0,n.jsx)(o.li,{children:"Selection improvements and increase/decrease font-size in a session."}),"\n",(0,n.jsx)(o.li,{children:"Migration to Corcovado."}),"\n"]}),"\n",(0,n.jsx)("br",{}),"\n",(0,n.jsx)(o.h1,{id:"overview",children:"Overview"}),"\n",(0,n.jsx)(o.p,{children:"Rio release 0.0.8 is finally here, there's a lot of updates to cover so let's get started. I also would like to remind you that Rio is still unstable. This release adds a lot of bug fixes and feature additions in order to make Rio terminal stable."}),"\n",(0,n.jsx)(o.h2,{id:"microsoft-windows",children:"Microsoft Windows"}),"\n",(0,n.jsx)(o.p,{children:"Added support to Microsoft Windows."}),"\n",(0,n.jsxs)(o.p,{children:["Windows 10:\n",(0,n.jsx)(o.img,{alt:"Demo windows in use",src:s(5368).A+"",width:"806",height:"563"})]}),"\n",(0,n.jsxs)(o.p,{children:["Windows 11:\n",(0,n.jsx)(o.img,{alt:"Demo windows in search",src:s(5368).A+"",width:"806",height:"563"})]}),"\n",(0,n.jsx)(o.h2,{id:"homebrew-as-cask",children:"Homebrew as Cask"}),"\n",(0,n.jsx)(o.p,{children:"Homebrew is a free and open-source software package management system that simplifies the installation of software on Apple's operating system, macOS."}),"\n",(0,n.jsxs)(o.p,{children:["Rio has been added as a cask ",(0,n.jsx)(o.a,{href:"https://formulae.brew.sh/cask/rio",children:"formulae.brew.sh/cask/rio"})," to their package source. To install Rio with homebrew you need to run the command below:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-sh",children:"brew update && brew install --cask rio\n"})}),"\n",(0,n.jsxs)(o.p,{children:["Github reference: ",(0,n.jsx)(o.a,{href:"https://github.com/Homebrew/homebrew-cask/pull/149824",children:"github.com/Homebrew/homebrew-cask/pull/149824"})]}),"\n",(0,n.jsx)(o.h2,{id:"homebrew-as-formula",children:"Homebrew as Formula"}),"\n",(0,n.jsxs)(o.p,{children:["Rio has been added as a formula ",(0,n.jsx)(o.a,{href:"https://formulae.brew.sh/formula/rio",children:"formulae.brew.sh/formula/rio"})," to their package source. To install Rio with homebrew you need to run the command below:"]}),"\n",(0,n.jsx)(o.pre,{children:(0,n.jsx)(o.code,{className:"language-sh",children:"brew update && brew install rio\n"})}),"\n",(0,n.jsxs)(o.p,{children:["Github reference: ",(0,n.jsx)(o.a,{href:"https://github.com/Homebrew/homebrew-core/pull/134295",children:"github.com/Homebrew/homebrew-cask/pull/149824"})]}),"\n",(0,n.jsx)(o.h2,{id:"selection-improvements-and-increasedecrease-font-size-in-a-session",children:"Selection improvements and increase/decrease font-size in a session"}),"\n",(0,n.jsx)(o.p,{children:"The version v0.0.8 has added the following missing functionalities: Scroll and select, Semantic and line selection and the ability to increase, decrease and reset font size using keyboard shortcut during session coming for Rio terminal."}),"\n",(0,n.jsx)(o.p,{children:"Below you can see a demo with all those functionalities:"}),"\n",(0,n.jsx)(a.Y,{id:"1673705339336761344"}),"\n",(0,n.jsx)(o.h2,{id:"migration-to-corcovado",children:"Migration to Corcovado"}),"\n",(0,n.jsx)(o.p,{children:"Rio terminal migrated from Mio to Corcovado. Corcovado is a maintained fork of mio 0.6.x along mio-signal-hook, mio-extras and using Windows API that works in Windows 11. It uses Rust edition 2021 instead of 2018."}),"\n",(0,n.jsx)(o.p,{children:"Corcovado also uses Rust standard library for net and io instead of Mio 0.6.x."}),"\n",(0,n.jsx)("br",{}),"\n",(0,n.jsx)(o.h2,{id:"changelog-of-v008",children:"Changelog of v0.0.8"}),"\n",(0,n.jsxs)(o.ul,{children:["\n",(0,n.jsx)(o.li,{children:'Added generation of ".msi" and ".exe" files to the release pipeline (stable and canary).'}),"\n",(0,n.jsx)(o.li,{children:"Support to Microsoft Windows 11."}),"\n",(0,n.jsxs)(o.li,{children:["Ability to in/decrease font size using keyboard shortcut during session (ref: ",(0,n.jsx)(o.a,{href:"https://github.com/raphamorim/rio/issues/109",children:"#109"}),")"]}),"\n",(0,n.jsx)(o.li,{children:"Inverted Canary and Stable icons."}),"\n",(0,n.jsx)(o.li,{children:"ANSI mouse reports (e.g: scroll and click working on VIM)."}),"\n",(0,n.jsx)(o.li,{children:"Scroll and apply selection."}),"\n",(0,n.jsx)(o.li,{children:"Semantic and line selection."}),"\n",(0,n.jsx)(o.li,{children:"Rio is available in Homebrew casks and formulas."}),"\n",(0,n.jsx)(o.li,{children:"Rio stable versions are notarized now."}),"\n",(0,n.jsx)(o.li,{children:"Migration of mio, mio-extras, mio-signal-hook to Corcovado."}),"\n",(0,n.jsx)(o.li,{children:'Changed default black color to "#4c4345".'}),"\n",(0,n.jsx)(o.li,{children:"Fix mouse position for when selecting text."}),"\n"]})]})}function m(e={}){const{wrapper:o}={...(0,r.R)(),...e.components};return o?(0,n.jsx)(o,{...e,children:(0,n.jsx)(h,{...e})}):h(e)}},5368:(e,o,s)=>{s.d(o,{A:()=>i});const i=s.p+"assets/images/demo-windows-11-bad66a98a794d3a573fd3456ad7c7ab5.png"},3577:e=>{e.exports=JSON.parse('{"permalink":"/blog/2023/07/10/release-0.0.8","editUrl":"https://github.com/raphamorim/rio/tree/main/docs/blog/2023-07-10-release-0.0.8.mdx","source":"@site/blog/2023-07-10-release-0.0.8.mdx","title":"Rio 0.0.8","description":"Support to Microsoft Windows, Homebrew casks and formulas, migration to Corcovado, selection improvements and increase/decrease font-size in a session.","date":"2023-07-03T12:34:00.000Z","tags":[],"readingTime":2.14,"hasTruncateMarker":false,"authors":[],"frontMatter":{"layout":"post","title":"Rio 0.0.8","date":"2023-07-03 12:34","description":"Support to Microsoft Windows, Homebrew casks and formulas, migration to Corcovado, selection improvements and increase/decrease font-size in a session.","categories":"release windows macos linux"},"unlisted":false,"prevItem":{"title":"Rio 0.0.7","permalink":"/blog/2023/07/07/release-0.0.7"},"nextItem":{"title":"Release 0.0.6","permalink":"/blog/2023/06/07/release-0.0.6"}}')}}]);