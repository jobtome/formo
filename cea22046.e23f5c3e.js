(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{76:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return r})),n.d(t,"toc",(function(){return l})),n.d(t,"default",(function(){return p}));var a=n(3),i=n(7),o=(n(0),n(87)),s={id:"validating-fields",title:"Validating fields"},r={unversionedId:"validating-fields",id:"validating-fields",isDocsHomePage:!1,title:"Validating fields",description:"formo supports validation of fields using using Validators, a thin",source:"@site/docs/validating-fields.md",slug:"/validating-fields",permalink:"/formo/validating-fields",editUrl:"https://github.com/buildo/formo/edit/main/website/docs/validating-fields.md",version:"current",sidebar:"someSidebar",previous:{title:"Recommended patterns",permalink:"/formo/recommended-patterns"},next:{title:"Submitting a form",permalink:"/formo/submitting"}},l=[{value:"Multiple validations on a field",id:"multiple-validations-on-a-field",children:[]},{value:"Transforming values",id:"transforming-values",children:[]},{value:"Defining custom validations",id:"defining-custom-validations",children:[]},{value:"Integrating with <code>io-ts</code>",id:"integrating-with-io-ts",children:[]}],d={toc:l};function p(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},d,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"formo")," supports validation of fields using using ",Object(o.b)("inlineCode",{parentName:"p"},"Validator"),"s, a thin\nabstraction layer over ",Object(o.b)("inlineCode",{parentName:"p"},"ReaderTaskEither")," from ",Object(o.b)("inlineCode",{parentName:"p"},"fp-ts"),"."),Object(o.b)("p",null,"Here's a quick example of a validator in action:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},'import { useFormo, validators } from "formo";\n\nconst { fieldProps } = useFormo(\n  {\n    initialValues: {\n      name: "",\n    },\n    fieldValidators: () => {\n      name: validators.minLength(2, "Name is too short");\n    },\n  },\n  {\n    onSubmit: (values) => taskEither.right(values),\n  }\n);\n')),Object(o.b)("p",null,"Here we are validating the ",Object(o.b)("inlineCode",{parentName:"p"},"name")," field to make sure it's at least 2 character\nlong. The result of this validation can be access with:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},'fieldProps("name").issues; // Option<NonEmptyArray<string>>\n')),Object(o.b)("div",{className:"admonition admonition-tip alert alert--success"},Object(o.b)("div",{parentName:"div",className:"admonition-heading"},Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",{parentName:"h5",className:"admonition-icon"},Object(o.b)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},Object(o.b)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),Object(o.b)("div",{parentName:"div",className:"admonition-content"},Object(o.b)("p",{parentName:"div"},"The type of ",Object(o.b)("inlineCode",{parentName:"p"},"issues")," depends on the type of error passed to the validators."),Object(o.b)("p",{parentName:"div"},"For instance, if we were to use a validator like this:"),Object(o.b)("pre",{parentName:"div"},Object(o.b)("code",{parentName:"pre",className:"language-ts"},'validators.minLength(2, { message: "Name is too short", severity: 1 });\n')),Object(o.b)("p",{parentName:"div"},"then the type of ",Object(o.b)("inlineCode",{parentName:"p"},"issues")," would be\n",Object(o.b)("inlineCode",{parentName:"p"},"Option<NonEmptyArray<{ message: string, severity: number }>>")))),Object(o.b)("h2",{id:"multiple-validations-on-a-field"},"Multiple validations on a field"),Object(o.b)("p",null,"Some fields may require multiple validations. We can combine validations using\nthe ",Object(o.b)("inlineCode",{parentName:"p"},"inSequence")," and ",Object(o.b)("inlineCode",{parentName:"p"},"inParallel")," combinators."),Object(o.b)("p",null,"As the name suggests, ",Object(o.b)("inlineCode",{parentName:"p"},"inSequence")," runs validations one after the other and the\nfield's ",Object(o.b)("inlineCode",{parentName:"p"},"issues")," will contain the first validation that failed:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},'validators.inSequence(\n  validators.minLength(2, "Too short"),\n  validators.regex(/$[A-Z]/, "Must start with an uppercase letter")\n);\n')),Object(o.b)("p",null,"Alternatively, we can run the same validations in parallel:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},'validators.inParallel(\n  validators.minLength(2, "Too short"),\n  validators.regex(/$[A-Z]/, "Must start with an uppercase letter")\n);\n')),Object(o.b)("p",null,"In this case, the field's ",Object(o.b)("inlineCode",{parentName:"p"},"issues")," will contain all the failed validations."),Object(o.b)("h2",{id:"transforming-values"},"Transforming values"),Object(o.b)("p",null,"If we take a look at how ",Object(o.b)("inlineCode",{parentName:"p"},"Validator")," is defined, we will notice that it has both\nan input and an output type. While it's common that they are the same, this also\nmeans that ",Object(o.b)("inlineCode",{parentName:"p"},"Validators")," can produce a value which is different than the one in\ninput."),Object(o.b)("div",{className:"admonition admonition-note alert alert--secondary"},Object(o.b)("div",{parentName:"div",className:"admonition-heading"},Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",{parentName:"h5",className:"admonition-icon"},Object(o.b)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},Object(o.b)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),Object(o.b)("div",{parentName:"div",className:"admonition-content"},Object(o.b)("p",{parentName:"div"},'This capability means that we\'re technically "parsing" instead of "validating"\nthe field values.'),Object(o.b)("p",{parentName:"div"},'We sticked to "validation" to preserve familiarity with the term in the context\nof forms.'),Object(o.b)("p",{parentName:"div"},"Here's an excellent blog post that explains the difference between parsing and\nvalidating: ",Object(o.b)("a",{parentName:"p",href:"https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/"},"https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/")))),Object(o.b)("p",null,"One example of validation that transforms the value is the ",Object(o.b)("inlineCode",{parentName:"p"},"validators.defined"),"\nvalidator:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},'useFormo(\n  {\n    initialValues: {\n      profession: option.none as Option<string>,\n    },\n    fieldValidations: () => {\n      profession: validators.defined("You must choose a profession");\n    },\n  },\n  {\n    onSubmit: ({ profession }) => {\n      return taskEither.right(\n        profession // profession is `string`, not `Option<string>`\n      );\n    },\n  }\n);\n')),Object(o.b)("p",null,"As we discussed, ",Object(o.b)("inlineCode",{parentName:"p"},"onSubmit")," is only ever called after all field validations\nsucceed, and this is reflected in the types."),Object(o.b)("p",null,"In this example ",Object(o.b)("inlineCode",{parentName:"p"},"profession")," has type ",Object(o.b)("inlineCode",{parentName:"p"},"string"),", while the non-validated field is\nan ",Object(o.b)("inlineCode",{parentName:"p"},"Option<string>"),"."),Object(o.b)("p",null,"This is a very powerful capability, because it allows you to preserve in the\ntypes some useful information you checked during validation."),Object(o.b)("h2",{id:"defining-custom-validations"},"Defining custom validations"),Object(o.b)("p",null,Object(o.b)("inlineCode",{parentName:"p"},"formo")," comes with a set of common validators, but you can of course augment\nthem by providing your own."),Object(o.b)("p",null,"For instance, you may leverage existing validators:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},"const startsWithUppercaseLetter = <E>(errorMessage: E) =>\n  validators.regex(/$[A-Z]/, errorMessage);\n")),Object(o.b)("p",null,"or you could go completely custom using the ",Object(o.b)("inlineCode",{parentName:"p"},"validator")," combinator:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},"const perfectNumber = <E>(errorMessage) =>\n  validators.validator((n: number) =>\n    n === 42 ? either.right(i) : either.left(errorMessage)\n  );\n")),Object(o.b)("h2",{id:"integrating-with-io-ts"},"Integrating with ",Object(o.b)("inlineCode",{parentName:"h2"},"io-ts")),Object(o.b)("p",null,Object(o.b)("a",{parentName:"p",href:"https://github.com/gcanti/io-ts"},Object(o.b)("inlineCode",{parentName:"a"},"io-ts"))," is a library based on ",Object(o.b)("inlineCode",{parentName:"p"},"fp-ts")," which\nprovides utilities to encode/decode values based on runtime type."),Object(o.b)("p",null,"If you have a ",Object(o.b)("inlineCode",{parentName:"p"},"io-ts")," type which you want to use for validation purposes, it's\nquite simple to do it. For example, let's define a validator for the\n",Object(o.b)("inlineCode",{parentName:"p"},"NonEmptyString")," type provided by the\n",Object(o.b)("a",{parentName:"p",href:"https://github.com/gcanti/io-ts-types"},Object(o.b)("inlineCode",{parentName:"a"},"io-ts-types"))," library."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-ts"},'import { validators } from "formo";\nimport { NonEmptyString } from "io-ts-types/NonEmptyString";\nimport { either } from "fp-ts";\nimport { flow } from "fp-ts/function";\n\nconst nonEmptyString = <E>(\n  errorMessage: E\n): Validator<string, NonEmptyString, E> =>\n  validators.validator(\n    flow(NonEmptyString.decode, either.mapLeft(constant(errorMessage)))\n  );\n')))}p.isMDXComponent=!0}}]);