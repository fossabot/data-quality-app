import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component';
import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar';
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store';
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom';
import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress';
import FeedbackSnackbar from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbar.component';
import './custom-css/D2UISidebarOverrides.css';

import AppRouter from './components/app-router/AppRouter';

import styles from './App.css';

// App configs
import { sections } from './pages/sections.conf';

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent);

class App extends PureComponent {
  static propTypes = {
      t: PropTypes.func.isRequired,
  };

  static childContextTypes = {
      showSnackbar: PropTypes.bool,
      snackbarConf: PropTypes.shape({
          type: PropTypes.string,
          message: PropTypes.string,
      }),
      currentSection: PropTypes.string,
      updateAppState: PropTypes.func,
      translator: PropTypes.func,
  };

  constructor(props) {
      super(props);

      this.state = {
          currentSection: '',
          showSnackbar: false,
          snackbarConf: {
              type: '',
              message: '',
          },
          pageState: {},
      };

      this.updateAppState = this.updateAppState.bind(this);
  }

  getChildContext() {
      return {
          showSnackbar: this.state.showSnackbar,
          snackbarConf: this.state.snackbarConf,
          currentSection: this.state.currentSection,
          updateAppState: this.updateAppState,
          translator: this.props.t,
      };
  }

  updateAppState(appState) {
      if (appState.currentSection
        && !appState.pageState
        && this.state.currentSection !== appState.currentSection) {
      // clear page state because we are updating page
          this.setState({ ...appState, pageState: {}, showSnackbar: false });
      } else {
          this.setState(appState);
      }
  }

  render() {
      const nonOnChangeSection = () => null;
      const translator = this.props.t;
      const translatedSections = sections.map(section => Object.assign(
          section,
          {
              icon: section.info.icon,
              label: translator(section.info.label),
              containerElement: <Link to={section.path} />,
          },
      ));

      const feedbackElement = this.state.pageState.loading ?
          (
              <div className={styles.centered}>
                  <CircularProgress />
              </div>
          ) : (
              <FeedbackSnackbar
                  show={this.state.showSnackbar}
                  conf={this.state.snackbarConf}
              />
          );

      return (
          <div>
              <HeaderBar />
              <Sidebar
                  sections={translatedSections}
                  currentSection={this.state.currentSection}
                  onChangeSection={nonOnChangeSection}
              />
              <div className={styles.contentWrapper}>
                  <div className={styles.contentArea}>
                      <AppRouter
                          pageState={this.state.pageState}
                      />
                  </div>
              </div>
              <div id="feedback-snackbar">
                  {feedbackElement}
              </div>
          </div>
      );
  }
}

export default App;
