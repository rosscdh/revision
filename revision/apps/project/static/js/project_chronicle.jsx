/** @jsx React.DOM */
/**
* Project chronicle controls
*
*/
var ChronicleBase = React.createClass({
    render: function () {
        return (<span/>);
    }
});
// render chronicle
React.renderComponent(
  <ChronicleBase />,
  document.getElementById('project-detail-chronicle')
);