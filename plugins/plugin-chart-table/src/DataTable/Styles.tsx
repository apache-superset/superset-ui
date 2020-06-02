import styled from '@superset-ui/style';

export default styled.div`
  margin: 0 auto;
  table {
    min-width: 100%;
    margin: 0;
  }

  thead > tr > th {
    padding-right: 1.4em;
    position: relative;
    background: #fff;
  }
  th svg {
    color: #ccc;
    position: absolute;
    bottom: 0.7em;
    right: 0.2em;
  }
  th.is-sorted svg {
    color: #a8a8a8;
  }

  .dt-metric {
    text-align: right;
  }
  td.dt-is-filter {
    cursor: pointer;
  }
  td.dt-is-filter:hover {
    background-color: linen;
  }
  td.dt-is-active-filter,
  td.dt-is-active-filter:hover {
    background-color: lightcyan;
  }

  .dt-global-filter {
    float: right;
  }

  .dt-pagination {
    text-align: right;
    margin-top: 0.5em;
  }
  .dt-pagination .pagination {
    margin: 0;
  }

  .pagination > li > span.dt-pagination-ellipsis:focus,
  .pagination > li > span.dt-pagination-ellipsis:hover {
    background: #fff;
  }

  .dt-no-results {
    text-align: center;
  }
`;
