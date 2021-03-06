import React, {Component, PropTypes} from 'react';
import createTreeStore from '../stores/tree';
import {createStore} from 'redux';
import {Provider, Connector, connect} from 'react-redux';
import bindActionCreators from '../utils/bindActionCreators';
import * as actions from '../actions';


class ConnectedQuery extends Component {
    componentWillReceiveProps(nextProps) {
        const {tree, onChange} = nextProps;
        const oldTree = this.props.tree;
        if (oldTree !== tree) {
            onChange && onChange(tree);
            this.setState({treeChanged: true})
        } else {
            this.setState({treeChanged: false})
        }
    }

    render() {
        const {config, tree, get_children, dispatch, ...props} = this.props;
        return <div>
            {get_children({
                tree: tree,
                actions: bindActionCreators({...actions.tree, ...actions.group, ...actions.rule}, config, dispatch),
                config: config,
                dispatch: dispatch
            })}
        </div>
    }
}
const QueryContainer = connect(
    (tree) => {
        return {tree: tree}
    },
)(ConnectedQuery);

export default class Query extends Component {
    static propTypes:{
        conjunctions: PropTypes.object.isRequired,
        fields: PropTypes.object.isRequired,
        operators: PropTypes.object.isRequired,
        widgets: PropTypes.object.isRequired,
        settings: PropTypes.object.isRequired
        };

    constructor(props, context) {
        super(props, context);
        const config = {
            conjunctions: props.conjunctions,
            fields: props.fields,
            operators: props.operators,
            widgets: props.widgets,
            settings: props.settings,
            tree: props.value,
        };

        const tree = createTreeStore(config);

        this.state = {
            store: createStore(tree)
        };
    }


    render() {
        const {conjunctions, fields, operators, widgets, settings, get_children, onChange, onBlur, value, tree, children, ...props} = this.props;
        const config = {conjunctions, fields, operators, widgets, settings};

        return (
            <Provider store={this.state.store}>
                <QueryContainer store={this.state.store} get_children={get_children} config={config} onChange={onChange}/>
            </Provider>
        )
    }
}
