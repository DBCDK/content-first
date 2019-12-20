import React from 'react';
import T from '../../base/T';
import Button from '../../base/Button';
import Toolbar from '../../base/Toolbar';
import Banner from '../../base/Banner';
import Text from '../../base/Text';
import Heading from '../../base/Heading';
import Kiosk from '../../base/Kiosk/Kiosk';

import './KioskSetup.css';

export default class KioskSetup extends React.Component {
  render() {
    return (
      <div className="KioskSetup">
        <Banner
          title={T({component: 'kioskSetup', name: 'title'})}
          className="fixed-width-col-md"
        />
        <Kiosk
          render={({kiosk, start}) => {
            return (
              <div className="KioskSetup__container col-centered">
                {kiosk.error && (
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
