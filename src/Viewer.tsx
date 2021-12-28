import React from 'react';
import ReactDOM from 'react-dom';
import { PreviewUIProp, PreviewUI, UIProps } from './libs/class';
import { destroyedErrMsg } from './libs/constants';
import { I18nContext, FontContext } from './libs/contexts';
import Preview from './components/Preview';

class Viewer extends PreviewUI {
  constructor(props: PreviewUIProp & UIProps) {
    const { domContainer, template, size, inputs, options } = props;
    super({ domContainer, template, size, inputs, options });
  }

  render() {
    if (!this.domContainer) throw new Error(destroyedErrMsg);
    ReactDOM.render(
      <I18nContext.Provider value={this.getI18n()}>
        <FontContext.Provider value={this.getFont()}>
          <Preview template={this.template} size={this.size} inputs={this.inputs} />
        </FontContext.Provider>
      </I18nContext.Provider>,
      this.domContainer
    );
  }
}

export default Viewer;
