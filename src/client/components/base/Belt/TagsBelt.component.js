import React from 'react';
import {get} from 'lodash';
import Textarea from 'react-textarea-autosize';
import {isMobileOnly} from 'react-device-detect';
import Pin from '../Pin';
import {withIsVisible, withScrollToComponent} from '../../hoc/Scroll';
import {withChildBelt, withStoreBelt} from '../../hoc/Belt';
import {withTagsToPids} from '../../hoc/Recommender';
import {withLoggedInUser} from '../../hoc/User';
import WorkSlider from './WorkSlider.component';
import Title from '../Title';
import Link from '../../general/Link.component';
import Term from '../Term';
import {filtersMapAll} from '../../../redux/filter.reducer';
import ContextMenu, {ContextMenuAction} from '../ContextMenu';
import Text from '../Text';
import Icon from '../Icon';
import T from '../T';
import Button from '../Button';
import './TagsBelt.css';

const EditBelt = props => {
  if (isMobileOnly) {
    return <BeltContextMenu onClick={props.onClick} />;
  }

  return (
    <div
      className="Belt_editButton d-flex align-items-center mt-2"
      onClick={props.onClick}
    >
      <Icon className="md-small" name="edit" />
      <Text className="m-0 ml-2 " type="small">
        <T component="general" name="edit" />
      </Text>
    </div>
  );
};

const BeltContextMenu = ({onClick}) => {
  const style = {position: 'absolute', right: 0, top: '42px', zIndex: 1};

  return (
    <ContextMenu title={''} className={'mt-2 mr-2'} style={style}>
      <ContextMenuAction
        title={T({component: 'general', name: 'editMultiple'})}
        icon="edit"
        onClick={onClick}
      />
    </ContextMenu>
  );
};

export class TagsBelt extends React.Component {
  constructor() {
    super();
    this.state = {editing: false, name: '', subtext: ''};
  }

  render() {
    const isOwner =
      this.props._owner &&
      this.props._owner === get(this.props, 'user.openplatformId');
    const tags = this.props.plainSelectedTagIds;
    const editing = this.state.editing;
    const titleMissing = this.state.name.trim().length === 0;
    const titleMissingClass = titleMissing ? 'value-missing' : '';
    const origin = {
      type: 'searchTags',
      tags: tags.map(t => {
        const tag = filtersMapAll[t.id ? t.id : t];
        return get(tag, 'id');
      })
    };

    return (
      <div
        id={`temp_${tags.map(v => v.id || v).join('')}`}
        className={'belt ' + this.props.className}
        data-cy={`tagsbelt-${this.props.name}`}
      >
        <div className="mb-0 px-0 px-sm-3 px-lg-5 pt-5 d-flex position-relative">
          {editing ? (
            <div className="w-100">
              <div className="d-flex flex-row">
                <Textarea
                  className={`w-100 ${titleMissingClass} Title Title__title4 Title__title4--transform-uppercase p-1 mt-1 mr-4`}
                  name="belt-name"
                  placeholder={T({
                    component: 'belts',
                    name: 'pinPlaceholderTitle'
                  })}
                  onChange={e => this.setState({name: e.target.value})}
                  maxRows={1}
                  value={this.state.name}
                />

                <div className="scrollable-tags d-sm-inline h-scroll-xs h-scroll-sm-none align-self-center ml-sm-0">
                  {tags.map((t, idx) => {
                    const tag = filtersMapAll[t.id ? t.id : t];
                    const isLast = idx === tags.length - 1;
                    return (
                      <Link
                        key={tag.id}
                        href="/find"
                        params={{tags: tag.id}}
                        data-cy={`tag-${tag.title}`}
                      >
                        <Term
                          className={'my-1 ' + (isLast ? '' : 'mr-2')}
                          size="medium"
                          style={{verticalAlign: 'baseline'}}
                        >
                          {tag.title}
                        </Term>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2">
                <Textarea
                  className={`Title Title__title5 p-1 w-100`}
                  name="belt-description"
                  placeholder={T({
                    component: 'belts',
                    name: 'pinPlaceholderDescription'
                  })}
                  onChange={e => this.setState({subtext: e.target.value})}
                  value={this.state.subtext}
                />
              </div>

              <div className="d-flex w-100 w-sm-auto flex-row-reverse flex-sm-row mb-4 mt-3">
                <Button
                  type="quaternary"
                  size="medium"
                  className="mr-0 mr-sm-2 ml-2 ml-sm-0"
                  onClick={() => {
                    this.props.updateBelt({
                      name: this.state.name,
                      subtext: this.state.subtext
                    });
                    this.setState({editing: false});
                  }}
                  disabled={this.state.name.trim().length === 0}
                >
                  <T component="general" name="saveChanges" />
                </Button>
                <Button
                  type="link"
                  size="medium"
                  className="mx-2"
                  onClick={() => this.setState({editing: false})}
                >
                  <T component="general" name="cancel" />
                </Button>
              </div>
            </div>
          ) : (
            <React.Fragment>
              <div className="">
                <div className="pl-0 d-flex flex-wrap mw-100">
                  <Link
                    href="/find"
                    params={{
                      tags: tags.map(t => (t.id ? t.id : t)).join(',')
                    }}
                    onClick={() => {
                      if (this.props.updateMount) {
                        this.props.updateMount({titleClick: origin});
                      }
                    }}
                  >
                    <Title
                      Tag="h1"
                      type="title4"
                      variant="transform-uppercase"
                      className="m-0 p-0 pr-4 ml-2 ml-sm-0 mr-4 my-1 border-right-sm-1"
                      style={{lineHeight: 'inherit'}}
                    >
                      {this.props.name.split(' ').map((word, idx) => {
                        if (idx === 0) {
                          return <strong key={idx}>{word}</strong>;
                        }
                        return ' ' + word;
                      })}
                    </Title>
                  </Link>
                  {isOwner && (
                    <Pin
                      icon="delete"
                      className="d-inline mr-4 mt-2"
                      active={true}
                      onClick={this.props.removeBelt}
                    />
                  )}
                  <div className="scrollable-tags d-sm-inline h-scroll-xs h-scroll-sm-none align-self-center ml-sm-0">
                    {tags.map((t, idx) => {
                      const tag = filtersMapAll[t.id ? t.id : t];
                      const isLast = idx === tags.length - 1;
                      return (
                        <Link
                          key={tag.id}
                          href="/find"
                          params={{tags: tag.id}}
                          onClick={() => {
                            if (this.props.updateMount) {
                              this.props.updateMount({
                                beltName: origin,
                                tagClick: tag.title
                              });
                            }
                          }}
                          data-cy={`tag-${tag.title}`}
                        >
                          <Term
                            className={'my-1 ' + (isLast ? '' : 'mr-2')}
                            size="medium"
                            style={{verticalAlign: 'baseline'}}
                          >
                            {tag.title}
                          </Term>
                        </Link>
                      );
                    })}
                  </div>
                </div>
                <div className="d-flex">
                  <Title
                    Tag="h3"
                    type="title5"
                    className="mb-4 mt-2 ml-2 ml-sm-0 mr-2 w-100 w-sm-auto d-block "
                  >
                    {this.props.subtext || ''}
                  </Title>
                </div>
              </div>
              {isOwner && !editing && (
                <EditBelt
                  onClick={() =>
                    this.setState({
                      editing: true,
                      name: this.props.name,
                      subtext: this.props.subtext
                    })
                  }
                />
              )}
            </React.Fragment>
          )}
        </div>

        <WorkSlider
          {...this.props}
          className="TagsBelt"
          pids={this.props.recommendations}
          onMoreLikeThisClick={(wrk, bName, rid) =>
            this.props.openSimilarBelt(
              wrk,
              get(this, 'props.belt.name', 'unknownBeltName'),
              rid
            )
          }
          onWorkClick={(wrk, bName, rid) =>
            this.props.openWorkPreview(
              wrk,
              get(this, 'props.belt.name', 'unknownBeltName'),
              rid
            )
          }
          origin={origin}
        />
      </div>
    );
  }
}

export default withLoggedInUser(
  withStoreBelt(
    withChildBelt(
      withScrollToComponent(withIsVisible(withTagsToPids(TagsBelt)))
    )
  )
);
