(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{80:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),l=a(88),r=a(22),i=a(25),o=a(102),s=a(3),u=a(7),d=a(83),m=a(82),b=a(94),h=a(99),p=a(100),f=a(98),v=a(85),E=a(90),O=a(103),j=function(e){return c.a.createElement("svg",Object(s.a)({width:"20",height:"20",role:"img"},e),c.a.createElement("g",{fill:"#7a7a7a"},c.a.createElement("path",{d:"M9.992 10.023c0 .2-.062.399-.172.547l-4.996 7.492a.982.982 0 01-.828.454H1c-.55 0-1-.453-1-1 0-.2.059-.403.168-.551l4.629-6.942L.168 3.078A.939.939 0 010 2.528c0-.548.45-.997 1-.997h2.996c.352 0 .649.18.828.45L9.82 9.472c.11.148.172.347.172.55zm0 0"}),c.a.createElement("path",{d:"M19.98 10.023c0 .2-.058.399-.168.547l-4.996 7.492a.987.987 0 01-.828.454h-3c-.547 0-.996-.453-.996-1 0-.2.059-.403.168-.551l4.625-6.942-4.625-6.945a.939.939 0 01-.168-.55 1 1 0 01.996-.997h3c.348 0 .649.18.828.45l4.996 7.492c.11.148.168.347.168.55zm0 0"})))},g=a(101),k=a(68),C=a.n(k),y=["item","onItemClick","collapsible","activePath"],N=["item","onItemClick","activePath","collapsible"];var S=function e(t,a){return"link"===t.type?Object(m.isSamePath)(t.href,a):"category"===t.type&&t.items.some((function(t){return e(t,a)}))};function _(e){var t,a,l,r=e.item,i=e.onItemClick,o=e.collapsible,m=e.activePath,b=Object(u.a)(e,y),h=r.items,p=r.label,f=S(r,m),v=(a=f,l=Object(n.useRef)(a),Object(n.useEffect)((function(){l.current=a}),[a]),l.current),E=Object(n.useState)((function(){return!!o&&(!f&&r.collapsed)})),O=E[0],j=E[1],g=Object(n.useRef)(null),k=Object(n.useState)(void 0),N=k[0],_=k[1],I=function(e){var t;void 0===e&&(e=!0),_(e?(null===(t=g.current)||void 0===t?void 0:t.scrollHeight)+"px":void 0)};Object(n.useEffect)((function(){f&&!v&&O&&j(!1)}),[f,v,O]);var T=Object(n.useCallback)((function(e){e.preventDefault(),N||I(),setTimeout((function(){return j((function(e){return!e}))}),100)}),[N]);return 0===h.length?null:c.a.createElement("li",{className:Object(d.a)("menu__list-item",{"menu__list-item--collapsed":O}),key:p},c.a.createElement("a",Object(s.a)({className:Object(d.a)("menu__link",(t={"menu__link--sublist":o,"menu__link--active":o&&f},t[C.a.menuLinkText]=!o,t)),onClick:o?T:void 0,href:o?"#!":void 0},b),p),c.a.createElement("ul",{className:"menu__list",ref:g,style:{height:N},onTransitionEnd:function(){O||I(!1)}},h.map((function(e){return c.a.createElement(x,{tabIndex:O?"-1":"0",key:e.label,item:e,onItemClick:i,collapsible:o,activePath:m})}))))}function I(e){var t=e.item,a=e.onItemClick,n=e.activePath,l=(e.collapsible,Object(u.a)(e,N)),r=t.href,i=t.label,o=S(t,n);return c.a.createElement("li",{className:"menu__list-item",key:i},c.a.createElement(v.a,Object(s.a)({className:Object(d.a)("menu__link",{"menu__link--active":o}),to:r},Object(E.a)(r)?{isNavLink:!0,exact:!0,onClick:a}:{target:"_blank",rel:"noreferrer noopener"},l),i))}function x(e){return"category"===e.item.type?c.a.createElement(_,e):c.a.createElement(I,e)}var T=function(e){var t,a,l=e.path,r=e.sidebar,i=e.sidebarCollapsible,o=void 0===i||i,s=e.onCollapse,u=e.isHidden,v=Object(n.useState)(!1),E=v[0],k=v[1],y=Object(m.useThemeConfig)(),N=y.navbar.hideOnScroll,S=y.hideableSidebar,_=Object(b.a)().isAnnouncementBarClosed,I=Object(f.a)().scrollY;Object(h.a)(E);var T=Object(p.a)();return Object(n.useEffect)((function(){T===p.b.desktop&&k(!1)}),[T]),c.a.createElement("div",{className:Object(d.a)(C.a.sidebar,(t={},t[C.a.sidebarWithHideableNavbar]=N,t[C.a.sidebarHidden]=u,t))},N&&c.a.createElement(O.a,{tabIndex:-1,className:C.a.sidebarLogo}),c.a.createElement("div",{className:Object(d.a)("menu","menu--responsive","thin-scrollbar",C.a.menu,(a={"menu--show":E},a[C.a.menuWithAnnouncementBar]=!_&&0===I,a))},c.a.createElement("button",{"aria-label":E?"Close Menu":"Open Menu","aria-haspopup":"true",className:"button button--secondary button--sm menu__button",type:"button",onClick:function(){k(!E)}},E?c.a.createElement("span",{className:Object(d.a)(C.a.sidebarMenuIcon,C.a.sidebarMenuCloseIcon)},"\xd7"):c.a.createElement(g.a,{className:C.a.sidebarMenuIcon,height:24,width:24})),c.a.createElement("ul",{className:"menu__list"},r.map((function(e){return c.a.createElement(x,{key:e.label,item:e,onItemClick:function(e){e.target.blur(),k(!1)},collapsible:o,activePath:l})})))),S&&c.a.createElement("button",{type:"button",title:"Collapse sidebar","aria-label":"Collapse sidebar",className:Object(d.a)("button button--secondary button--outline",C.a.collapseSidebarButton),onClick:s},c.a.createElement(j,{className:C.a.collapseSidebarButtonIcon})))};a(69);var A=a(24);function M(e){var t,a=e.id,n=e.message;return null!==(t=A[null!=a?a:n])&&void 0!==t?t:n}function w(e){var t,a=e.children,n=null!==(t=M({message:a,id:e.id}))&&void 0!==t?t:a;return c.a.createElement(c.a.Fragment,null,n)}var B=["children"],P=function(e){var t,a,l,r=e.children,i=Object(u.a)(e,B),o=Object(n.useRef)(null),d=Object(n.useState)(!1),m=d[0],b=d[1];return c.a.createElement("pre",Object(s.a)({},i,{ref:o}),r,c.a.createElement("button",{type:"button","aria-label":(t={id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"},a=t.message,l=M({message:a,id:t.id}),null!=l?l:a),className:"copy-button",onClick:function(){o.current&&function(e,{target:t=document.body}={}){const a=document.createElement("textarea"),n=document.activeElement;a.value=e,a.setAttribute("readonly",""),a.style.contain="strict",a.style.position="absolute",a.style.left="-9999px",a.style.fontSize="12pt";const c=document.getSelection();let l=!1;c.rangeCount>0&&(l=c.getRangeAt(0)),t.append(a),a.select(),a.selectionStart=0,a.selectionEnd=e.length;let r=!1;try{r=document.execCommand("copy")}catch{}a.remove(),l&&(c.removeAllRanges(),c.addRange(l)),n&&n.focus()}(Array.from(o.current.querySelectorAll("code div.line")).map((function(e){return e.textContent})).join("\n")),b(!0),setTimeout((function(){return b(!1)}),2e3)}},m?c.a.createElement(w,{id:"theme.CodeBlock.copied",description:"The copied button label on code blocks"},"Copied"):c.a.createElement(w,{id:"theme.CodeBlock.copy",description:"The copy button label on code blocks"},"Copy")))},R=(a(70),a(71)),H=a.n(R),L=["id"],D=function(e){return function(t){var a,n=t.id,l=Object(u.a)(t,L),r=Object(m.useThemeConfig)().navbar.hideOnScroll;return n?c.a.createElement(e,l,c.a.createElement("a",{"aria-hidden":"true",tabIndex:-1,className:Object(d.a)("anchor",(a={},a[H.a.enhancedAnchor]=!r,a)),id:n}),l.children,c.a.createElement("a",{className:"hash-link",href:"#"+n,title:"Direct link to heading"},"#")):c.a.createElement(e,l)}},W=a(72),z=a.n(W),F={code:function(e){var t=e.children;return"string"==typeof t?t.includes("\n")?c.a.createElement(P,e):c.a.createElement("code",e):t},a:function(e){return c.a.createElement(v.a,e)},pre:function(e){return c.a.createElement("div",Object(s.a)({className:z.a.mdxCodeBlock},e))},h1:D("h1"),h2:D("h2"),h3:D("h3"),h4:D("h4"),h5:D("h5"),h6:D("h6")},J=Object.assign({},F,{div:function(e){return"shiki-twoslash-fragment"===e.className?c.a.createElement(c.a.Fragment,null,e.children):c.a.createElement("div",e)},pre:function(e){return c.a.createElement(P,e)},code:function(e){return c.a.createElement("code",e)}}),q=a(104),K=a(86),V=a(73),Y=a.n(V);function G(e){var t,a,i,s,u=e.currentDocRoute,b=e.versionMetadata,h=e.children,p=Object(r.default)(),f=p.siteConfig,v=p.isClient,E=b.pluginId,O=b.permalinkToSidebar,g=b.docsSidebars,k=b.version,C=O[u.path],y=g[C],N=Object(n.useState)(!1),S=N[0],_=N[1],I=Object(n.useState)(!1),x=I[0],A=I[1],M=Object(n.useCallback)((function(){x&&A(!1),_(!S)}),[x]);return c.a.createElement(o.a,{key:v,searchMetadatas:{version:k,tag:Object(m.docVersionSearchTag)(E,k)}},c.a.createElement("div",{className:Y.a.docPage},y&&c.a.createElement("div",{className:Object(d.a)(Y.a.docSidebarContainer,(t={},t[Y.a.docSidebarContainerHidden]=S,t)),onTransitionEnd:function(e){e.currentTarget.classList.contains(Y.a.docSidebarContainer)&&S&&A(!0)},role:"complementary"},c.a.createElement(T,{key:C,sidebar:y,path:u.path,sidebarCollapsible:null===(a=null===(i=f.themeConfig)||void 0===i?void 0:i.sidebarCollapsible)||void 0===a||a,onCollapse:M,isHidden:x}),x&&c.a.createElement("div",{className:Y.a.collapsedDocSidebar,title:"Expand sidebar","aria-label":"Expand sidebar",tabIndex:0,role:"button",onKeyDown:M,onClick:M},c.a.createElement(j,null))),c.a.createElement("main",{className:Y.a.docMainContainer},c.a.createElement("div",{className:Object(d.a)("container padding-vert--lg",Y.a.docItemWrapper,(s={},s[Y.a.docItemWrapperEnhanced]=S,s))},c.a.createElement(l.a,{components:J},h)))))}t.default=function(e){var t=e.route.routes,a=e.versionMetadata,n=e.location,l=t.find((function(e){return Object(K.matchPath)(n.pathname,e)}));return l?c.a.createElement(G,{currentDocRoute:l,versionMetadata:a},Object(i.a)(t)):c.a.createElement(q.default,e)}}}]);