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
import FileSelect from './FileSelect'

function Index(props) {
  switch(props.mainSection){
    case 'merge': 
      return ( <React.Fragment>
          <AppAppBar />
          <Merge />
          <AppFooter />
        </React.Fragment>
      );
    case 'fileSelect': 
      return ( <React.Fragment>
          <AppAppBar />
          <FileSelect />
          <AppFooter />
        </React.Fragment>
      );
    default: 
      return (<React.Fragment>
        <AppAppBar />
        <ProductHero />
        <ProductHowItWorks />
        <AppFooter />
      </React.Fragment>
      );
  };
}

export default withRoot(Index);
