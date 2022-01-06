import * as React from 'react';

const HowAddLanguage = () => {
  return (
    <div>
      <h2>How do I add a language</h2>
      Quisque quis lectus odio. Aenean condimentum, quam ac dictum ultricies,
      mauris ante ornare ante, eu blandit nibh ligula vitae odio. Proin non
      lacinia orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Nullam blandit dui et tortor facilisis, luctus accumsan turpis vehicula.
      Fusce justo lacus, faucibus eget dapibus non, malesuada nec dolor.
      Suspendisse non neque ac neque mollis sagittis. Cras at elit purus. Donec
      at sem blandit, volutpat nibh et, venenatis leo. Curabitur sagittis
      venenatis dui at faucibus. Sed fermentum eleifend ante eget consequat.
      Phasellus vitae ullamcorper lorem, in rhoncus tellus.
    </div>
  );
};

// Type 'NamedExoticComponent<unknown> & { readonly type: () => Element; }' is missing the following properties from type 'ReactElement<any, string | JSXElementConstructor<any>>': props, key

// (property) JSX.IntrinsicElements.h2: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
// Type 'NamedExoticComponent<unknown> & { readonly type: () => Element; }'
// is missing the following properties from type 'ReactElement<any, string | JSXElementConstructor<any>>': props, key

// (alias) namespace React
// import React

export default HowAddLanguage;
