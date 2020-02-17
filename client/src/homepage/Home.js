import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import ProductCategories from './modules/views/ProductCategories';
import ProductSmokingHero from './modules/views/ProductSmokingHero';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';
import ProductValues from './modules/views/ProductValues';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import ProductCTA from './modules/views/ProductCTA';
import AppAppBar from './modules/views/AppAppBar';
import Merge from './Merge'

function Index(props) {
  return props.merge ? (
    <React.Fragment>
      <AppAppBar />
       <Merge />
      <AppFooter />
    </React.Fragment>
  ) : (<React.Fragment>
    <AppAppBar />
    <ProductHero />
    <ProductHowItWorks />
    <AppFooter />
  </React.Fragment>);
}

export default withRoot(Index);
