import React, {Component} from 'react';
import {Card, Button} from 'antd'
import PropTypes from 'prop-types';

import Widgets from '../constants/Widgets';
import Services from '../constants/Services';

class Widget extends Component {

  render() {
    const WidgetComponent = Widgets[this.props.name].component;
    const icon = Services[Widgets[this.props.name].service].icon;
    let title = Widgets[this.props.name].title;

    if (typeof title === 'function') {
      title = title(this.props.config);
    }

    return (
      <Card
        title={
          <span>
            <img
              alt=''
              style={{width: 20, marginRight: 4}}
              src={icon}
            />
            {title}
          </span>
        }
        className="Widget"
        style={{width: 'min-content'}}
        extra={<Button style={{marginLeft: 16}} icon="close" onClick={() => this.props.onRemove(this.props.id)} />}
      >
        <WidgetComponent
          config={this.props.config}
          user={this.props.user}
        />
      </Card>
    );
  }
}

Widget.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  config: PropTypes.object,
  onRemove: PropTypes.func,
  user: PropTypes.object,
};

export default Widget;