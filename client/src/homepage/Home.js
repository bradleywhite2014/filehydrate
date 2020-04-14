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
import ToastMessage from '../components/ToastMessage'

function Index(props) {
  switch(props.mainSection){
    case 'merge': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar />
          <Merge />
          <ToastMessage />
        </div>
          <AppFooter />
        </React.Fragment>
      );
    case 'fileSelect': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar />
          <FileSelect />
          <ToastMessage />
          </div>
          <AppFooter />
        </React.Fragment>
      );
    default: 
      return (<React.Fragment>
        <div style={{minHeight: '100%'}}>
        <AppAppBar />
        <ProductHero />
        <ProductHowItWorks />
        <ToastMessage />
        <AppFooter />
        </div>
      </React.Fragment>
      );
  };
}

export default withRoot(Index);
