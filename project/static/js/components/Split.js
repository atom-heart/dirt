import React from 'react';

import { Card } from 'reactstrap';

import TableHeader from './TableHeader';
import SplitRanking from './SplitRanking';
import SplitProgress from './SplitProgress';
import ProgressButton from './ProgressButton';

class Split extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showProgress: false }
    
    this.toggleProgress = this.toggleProgress.bind(this);
  }

  toggleProgress(event) {
    this.setState({ showProgress: !this.state.showProgress });
  }

  render() {
    return (
      <Card>

        <TableHeader>
          <h4>{this.props.split.order}. {this.props.split.track}</h4>
          <span className="text-muted weather">{this.props.split.weather}</span>
        </TableHeader>

        {this.state.showProgress ? (
          <SplitProgress ranking={this.props.split.progress} />
        ) : (
          <SplitRanking ranking={this.props.split.ranking} />
        )}

        {this.props.split.finished &&
          <ProgressButton onClick={this.toggleProgress}>
            {this.state.showProgress ? 'Back to ranking' : 'Show progress'}
          </ProgressButton>
        }

      </Card>
    );
  }
}

export default Split;
