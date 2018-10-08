import ListErrors from './ListErrors';
import React from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import SubmitArticle from "./services/article";
import {
  ADD_TAG,
  EDITOR_PAGE_LOADED,
  REMOVE_TAG,
  ARTICLE_SUBMITTED,
  EDITOR_PAGE_UNLOADED,
  UPDATE_FIELD_EDITOR
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.editor
});

const mapDispatchToProps = dispatch => ({
  onAddTag: () =>
    dispatch({ type: ADD_TAG }),
  onLoad: payload =>
    dispatch({ type: EDITOR_PAGE_LOADED, payload }),
  onRemoveTag: tag =>
    dispatch({ type: REMOVE_TAG, tag }),
  onSubmit: payload =>
    dispatch({ type: ARTICLE_SUBMITTED, payload }),
  onUnload: payload =>
    dispatch({ type: EDITOR_PAGE_UNLOADED }),
  onUpdateField: (key, value) =>
    dispatch({ type: UPDATE_FIELD_EDITOR, key, value })
});

class Editor extends React.Component {
  constructor() {
    super();

    this.state = {
      url: "",
      title: "",
      summary: "",
      tagInput: "",
      tags: []
    };    

    this.updateField = this.updateField.bind(this);

    this.removeTagHandler = tag => () => {
      this.props.onRemoveTag(tag);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      if (nextProps.match.params.slug) {
        this.props.onUnload();
        return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
      }
      this.props.onLoad(null);
    }
  }

  componentWillMount() {
    if (this.props.match.params.slug) {
      return this.props.onLoad(agent.Articles.get(this.props.match.params.slug));
    }
    this.props.onLoad(null);
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  updateField(event) {
    this.setState({[event.target.name]: event.target.value});
  }  

  watchForEnter(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.setState(prevState => ({[event.target.name] : [...prevState["tags"], event.target.value]}));
    }
  };

  submitForm(event) {
    const {url, title, summary, tags} = this.state;
    event.preventDefault();

    const article = {
      url,
      title,
      summary,
      tags
    };    
  };

  render() {
    return (
      <div className="editor-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-10 offset-md-1 col-xs-12">

              <ListErrors errors={this.props.errors}></ListErrors>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="urlInput" className="form-control-label">URL</label>                  
                    <input
                      id="urlInput"
                      className="form-control"
                      type="text"
                      name="url"
                      value={this.state.url}
                      onChange={this.updateField} />
                  </fieldset>                  

                  <fieldset className="form-group">
                    <label htmlFor="titleInput" className="form-control-label">Title</label>
                    <input
                      id="titleInput"
                      name="titleInput"
                      className="form-control form-control-lg"
                      type="text"
                      value={this.props.title}
                      onChange={this.updateField} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="summaryInput" className="form-control-label">Summary</label>                  
                    <textarea
                      id="summaryInput"
                      name="summaryInput"
                      className="form-control"
                      rows="8"
                      value={this.props.body}
                      onChange={this.updateField}>
                    </textarea>
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="tagsInput" className="form-control-label">Tags</label>                  
                    <input
                      id="tagsInput"
                      name="tagInput"
                      className="form-control"
                      type="text"
                      value={this.state.tagInput}
                      onChange={this.updateField}
                      onKeyUp={this.watchForEnter} />

                    <div className="tag-list">
                        {this.state.tags.length > 0 && ([this.state.tags].map(tag => {
                          return (
                            <span className="tag-default tag-pill" key={tag}>
                              <i  className="ion-close-round"
                                  onClick={this.removeTagHandler(tag)}>
                              </i>
                              {tag}
                            </span>
                          );
                        })
                        )}
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-lg pull-xs-right btn-primary"
                    type="button"
                    disabled={this.props.inProgress}
                    onClick={this.submitForm}>
                    Publish Article
                  </button>

                </fieldset>
              </form>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
