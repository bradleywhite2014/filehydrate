import withRoot from './modules/withRoot';
// --- Post bootstrap -----
import React from 'react';
import AppFooter from './modules/views/AppFooter';
import ProductHero from './modules/views/ProductHero';
import ProductHowItWorks from './modules/views/ProductHowItWorks';
import AppAppBar from './modules/views/AppAppBar';
import Merge from './Merge'
import FileSelect from './FileSelect'
import ToastMessage from '../components/ToastMessage'
import GlobalModal from '../components/GlobalModal'
import NavHamburger from '../components/NavHamburger'
import TextField from '@material-ui/core/TextField';
import Button from '../components/Button';
import ApiManagement from './ApiManagement';
import DataTableModal from '../components/DataTableModal';


function Index(props) {
  switch(props.mainSection){
    case 'merge': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar firebase={props.firebase} />
          <Merge />
          <ToastMessage />
          <GlobalModal/>
          <DataTableModal/>
        </div>
          <AppFooter />
        </React.Fragment>
      );
    case 'fileMerge': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar firebase={props.firebase} />
          <FileSelect />
          <ToastMessage />
          <GlobalModal/>
          <DataTableModal/>
          </div>
          <AppFooter />
        </React.Fragment>
      );
    case 'apiconfiguration': 
      return ( <React.Fragment>
        <div style={{minHeight: '100%'}}>
          <AppAppBar firebase={props.firebase} />
          <ApiManagement/>
          <ToastMessage />
          <GlobalModal/>
          </div>
          <AppFooter />
        </React.Fragment>
      );
    case '404':
    return ( <React.Fragment>
      <div style={{minHeight: '100%'}}>
        <AppAppBar firebase={props.firebase} />
        {'Coming soon...'}
        <ToastMessage />
        <GlobalModal/>
        </div>
        <AppFooter />
      </React.Fragment>
    );
    default: 
      return (<React.Fragment>
        <div style={{minHeight: '100%'}}>
        <AppAppBar firebase={props.firebase} />
        <ProductHero />
        <ProductHowItWorks />
        <ToastMessage />
        <GlobalModal/>
        <DataTableModal/>
        <AppFooter />
        </div>
      </React.Fragment>
      );
  };
}

export default withRoot(Index);
