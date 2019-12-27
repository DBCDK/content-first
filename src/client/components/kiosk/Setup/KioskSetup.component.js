import React from 'react';
import T from '../../base/T';
import Button from '../../base/Button';
import Toolbar from '../../base/Toolbar';
import Banner from '../../base/Banner';
import Input from '../../base/Input';
import Text from '../../base/Text';
import Heading from '../../base/Heading';
import Kiosk from '../../base/Kiosk/Kiosk';

import './KioskSetup.css';

export default class KioskSetup extends React.Component {
  state = {branchKey: null};
  render() {
    return (
      <div className="KioskSetup">
        <Banner
          title={T({component: 'kioskSetup', name: 'title'})}
          className="fixed-width-col-md"
        />
        <Kiosk
          render={({kiosk, start, loadKiosk}) => {
            return (
              <div className="KioskSetup__container col-centered">
                <Input
                  placeholder={T({
                    component: 'kioskSetup',
                    name: 'placeholderBranchKey'
                  })}
                  onChange={e => this.setState({branchKey: e.target.value})}
                  value={
                    this.state.branchKey === null
                      ? kiosk.branchKey || ''
                      : this.state.branchKey
                  }
                  data-cy="input-client-id"
                >
                  <T component="kioskSetup" name="labelBranchKey" />
                </Input>
                <Button
                  className="submit-button"
                  type="quaternary"
                  onClick={() => loadKiosk({branchKey: this.state.branchKey})}
                  data-cy="kiosk-settings-submit"
                  disabled={
                    !this.state.branchKey ||
                    this.state.branchKey === kiosk.branchKey
                  }
                >
                  <T component="kioskSetup" name="submit" />
                </Button>
                {kiosk.error && this.state.branchKey === kiosk.branchKey && (
                  <Text
                    className="error"
                    variant="error"
                    align="right"
                    data-cy="kiosk-error-msg"
                  >
                    {kiosk.error}
                  </Text>
                )}
                {kiosk.configuration && (
                  <React.Fragment>
                    {/* <Divider variant="thin" /> */}
                    <Heading className="ready-header" Tag="h1" type="lead">
                      <T component="kioskSetup" name="readyHeader" />
                    </Heading>

                    <div className="attributes">
                      {Object.entries(kiosk.configuration).map(([key, val]) => {
                        return (
                          <div className="attribute-row" key={`${key}-${val}`}>
                            <Text className="key" variant="weight-semibold">
                              {key}
                            </Text>
                            <Text className="val">{val}</Text>
                          </div>
                        );
                      })}
                    </div>
                    <Toolbar>
                      <Button
                        type="secondary"
                        onClick={start}
                        align="left"
                        data-cy="kiosk-start-btn"
                      >
                        <T component="kioskSetup" name="startKiosk" />
                      </Button>
                    </Toolbar>
                  </React.Fragment>
                )}
              </div>
            );
          }}
        />
      </div>
    );
  }
}
