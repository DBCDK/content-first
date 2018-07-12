import React from 'react';
import {connect} from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import toColor from '../../utils/toColor';
import Button from '../base/Button/Button';
import Heading from '../base/Heading/Heading';
import Link from '../general/Link.component';
import './shortList.css';
import {
    ON_USERLISTS_COLLAPSE,
    ON_USERLISTS_EXPAND,

} from '../../redux/list.reducer';
import {
    ON_SHORTLIST_COLLAPSE,
} from '../../redux/shortlist.reducer';
import { HISTORY_PUSH } from '../../redux/middleware';

const ListElement = props => {
    const url = `/lister/${props.list.id}`;
    //console.log("in ShortListElement",url);

    const renderListsCover = (id, img, type) => {
        return img ? (
            type === 'SYSTEM_LIST' ?
                <img alt="" src={img} /> : <img alt="" src={'v1/image/' + img + '/50/50'} />
        ) : (
                <div
                    style={{ background: toColor(id), height: '40px', width: '40px' }}
                >

                </div>
            );
    }


    const isOwner = props.list && props.list._owner === props.userID;

    return (
        <div className="short-list-element">
            <div className="short-list-element--cover-image">
                <Link href={url}>
                    {renderListsCover(props.list.id, props.list.image, props.list.type)}

                </Link>
            </div>
            <div className="short-list-element--text">
                <div className="short-list-element--header">
                    <Link href={url}>{props.list.title}</Link>
                </div>
                <div className="short-list-element--taxonomy-description">
                    {props.list.description}
                </div>
                <div className="short-list-element--origin">{props.profiles[props.list._owner] && !isOwner ? props.profiles[props.list._owner].name : ""}</div>
            </div>

        </div>
    );
};

const UserListsContent = props => {

    return (
        <div
            className={`short-list--content text-left${
                props.expanded ? '' : ' slide-out'
                }`}
        >
            <Link href="/lister">
                <Heading type="peach-subtitle">
                    Lister
            </Heading>
            </Link>

            {props.children &&
                props.children.length > 0 && (
                    <div className="short-list--elements">
                        <ReactCSSTransitionGroup
                            transitionName="shortlist"
                            transitionEnterTimeout={200}
                            transitionLeaveTimeout={200}
                        >
                            {props.children}
                        </ReactCSSTransitionGroup>
                    </div>
                )}
            <div className="short-list--footer">
                <div onClick={() => props.onCreateNewList()}>
                    <Button size="medium" type="tertiary">
                        Opret ny liste
                        </Button>
                </div>
                <div onClick={() => props.onEditLists()}>
                    <Button size="medium" type="tertiary">
                        Rediger lister
                    </Button>
                </div>
            </div>
        </div>
    );
    return (<div
        className={`short-list--content text-left${
            props.expanded ? '' : ' slide-out'
            }`}>loading..</div>)

};

class ListOverviewDropDown extends React.Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.sortLists = this.sortLists.bind(this);

    }
    sortLists(lists) {
        lists = Object.values(lists);

        return lists.sort((a, b) => {

            let aDate = !a._owner === this.props.userID && this.props.followedLists[a.id] ? this.props.followedLists[a.id]._created : a._created;
            let bDate = !b._owner === this.props.userID && this.props.followedLists[a.id] ? this.props.followedLists[b.id]._created : b._created;

            aDate = a.type === 'SYSTEM_LIST' ? bDate + 1 : aDate;
            bDate = b.type === 'SYSTEM_LIST' ? aDate + 1 : bDate;

            return bDate - aDate;
        });

    }


    render() {
        const { expanded, lists } = this.props.listsState;
        //console.log("listsState",this.props.listsState)
        console.log("followedLists", this.props.followedLists)
        const sortedLists = this.sortLists(lists);

        return (
            <React.Fragment>
                <div
                    className={this.props.className + ' short-list'}
                    onClick={() => {
                        this.props.dispatch({
                            type: expanded ? ON_USERLISTS_COLLAPSE : ON_USERLISTS_EXPAND
                        });
                        if (this.props.shortListExpanded) {//collapse shortlist if expanded
                            this.props.dispatch({
                                type: ON_SHORTLIST_COLLAPSE
                            });
                        }
                    }}
                >
                    {this.props.children}
                </div>

                <UserListsContent
                    expanded={expanded}
                    lists={sortedLists}
                    onClose={() => this.props.dispatch({ type: ON_USERLISTS_COLLAPSE })}
                    onEditLists={() => {
                        this.props.dispatch({ type: HISTORY_PUSH, path: '/profile' });
                        this.props.dispatch({ type: ON_USERLISTS_COLLAPSE });
                    }}
                    onCreateNewList={() => {
                        this.props.dispatch({ type: HISTORY_PUSH, path: '/lister/opret' });
                        this.props.dispatch({ type: ON_USERLISTS_COLLAPSE });
                    }}
                >
                    {
                        (sortedLists.length > 0) &&
                        sortedLists.map((list) => {
                            //  console.log("list", list);
                            return (<ListElement
                                key={list.id}
                                list={list}
                                profiles={this.props.profiles}
                                userID={this.props.userID ? this.props.userID : ""}
                            />)
                        })}


                </UserListsContent>


            </React.Fragment>
        );
    }
}
export default connect(
    // Map redux state to props
    state => {
        return {
            listsState: state.listReducer,
            profiles: state.users.toJS(),
            shortListExpanded: state.shortListReducer.expanded,
            userID: state.userReducer.openplatformId,
            followedLists: state.followReducer


        };
    }
)(ListOverviewDropDown);
