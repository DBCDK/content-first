import React from 'react';
import {get} from 'lodash';
import Textarea from 'react-textarea-autosize';
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
import BeltSkeleton from './BeltSkeleton.component';
const EditBelt = props => {
  return (
    <React.Fragment>
      <BeltContextMenu {...props} />
      <div className="belt-tags__edit-button" onClick={props.onEditClick}>
        <Icon className="md-small" name="edit" />
        <Text type="small">
          <T component="general" name="edit" />
        </Text>
      </div>
    </React.Fragment>
  );
};

const BeltContextMenu = ({onEditClick, onDeleteClick}) => {
  return (
    <ContextMenu>
      <ContextMenuAction
        title={T({component: 'general', name: 'editMultiple'})}
        icon="edit"
        onClick={onEditClick}
      />
      <ContextMenuAction
        title={T({component: 'editStartPage', name: 'deleteBelt'})}
        icon="delete"
        onClick={onDeleteClick}
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
    const {
      _owner,
      subtext,
      plainSelectedTagIds,
      className = '',
      name = '',
      removeBelt,
      updateMount,
      openSimilarBelt,
      openWorkPreview,
      recommendations
    } = this.props;
    const isOwner = _owner && _owner === get(this.props, 'user.openplatformId');
    const tags = plainSelectedTagIds;
    const editing = this.state.editing;
    const editingClass = editing ? 'editing' : '';
    const titleMissing = this.state.name.trim().length === 0;
    const titleMissingClass = titleMissing ? 'value-missing' : '';
    const origin = {
      type: 'searchTags',
      tags: tags.map(t => {
        const tag = filtersMapAll[t.id ? t.id : t];
        return get(tag, 'id');
      })
    };
    if (this.props.id === 'skeletonBelt') {
      return <BeltSkeleton />;
    }

    return (
      <div
        id={`temp_${tags.map(v => v.id || v).join('')}`}
        className={`belt belt-tags ${className} ${editingClass}`}
        data-cy={`tagsbelt-${name}`}
      >
        <div className="belt-tags__content--wrap">
          <div className="belt-tags__title-tags--wrap">
            {!editing ? (
              <Link
                className="belt-tags__title--link"
                href="/find"
                params={{
                  tags: tags.map(t => (t.id ? t.id : t)).join(',')
                }}
                onClick={() => {
                  if (updateMount) {
                    updateMount({titleClick: origin});
                  }
                }}
              >
                <Title
                  Tag="h1"
                  type="title4"
                  variant="transform-uppercase"
                  className="belt-tags__title"
                  style={{lineHeight: 'inherit'}}
                >
                  {name.split(' ').map((word, idx) => {
                    if (idx === 0) {
                      return <strong key={idx}>{word}</strong>;
                    }
                    return ' ' + word;
                  })}
                </Title>
              </Link>
            ) : (
              <Textarea
                className={`${titleMissingClass} Title Title__title4 Title__title4--transform-uppercase`}
                name="belt-tags-name"
                placeholder={T({
                  component: 'belts',
                  name: 'pinPlaceholderTitle'
                })}
                onChange={e => this.setState({name: e.target.value})}
                value={this.state.name}
              />
            )}

            {isOwner && !editing && (
              <Pin icon="delete" active={true} onClick={removeBelt} />
            )}

            <div className="belt-tags__tags--container">
              {tags.map(t => {
                const tag = filtersMapAll[t.id ? t.id : t];
                return (
                  <Link
                    className="belt-tags__tag--link"
                    key={tag.id}
                    href="/find"
                    params={{tags: tag.id}}
                    onClick={() => {
                      if (updateMount) {
                        updateMount({
                          beltName: origin,
                          tagClick: tag.title
                        });
                      }
                    }}
                    data-cy={`tag-${tag.title}`}
                  >
                    <Term size="medium">{tag.title}</Term>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="belt-tags__description">
            {!editing ? (
              <Title
                Tag="h3"
                type="title5"
                className="belt-tags__description--title"
              >
                {subtext}
              </Title>
            ) : (
              <Textarea
                className={`Title Title__title5`}
                name="belt-tags-description"
                placeholder={T({
                  component: 'belts',
                  name: 'pinPlaceholderDescription'
                })}
                onChange={e => this.setState({subtext: e.target.value})}
                value={this.state.subtext}
              />
            )}
          </div>

          {editing && (
            <div className="belt-tags__edit-actions">
              <Button
                type="quaternary"
                size="medium"
                className="belt-tags__save--btn"
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
                className="belt-tags__cancel--btn"
                onClick={() => this.setState({editing: false})}
              >
                <T component="general" name="cancel" />
              </Button>
            </div>
          )}
        </div>
        {isOwner && !editing && (
          <EditBelt
            onEditClick={() =>
              this.setState({
                editing: true,
                name,
                subtext
              })
            }
            onDeleteClick={removeBelt}
          />
        )}

        <WorkSlider
          {...this.props}
          className="TagsBelt"
          pids={recommendations}
          onMoreLikeThisClick={(wrk, bName, rid) => {
            openSimilarBelt(
              wrk,
              get(this, 'props.belt.name', 'unknownBeltName'),
              rid
            );
          }}
          onWorkClick={(wrk, bName, rid) => {
            openWorkPreview(
              wrk,
              get(this, 'props.belt.name', 'unknownBeltName'),
              rid
            );
          }}
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
