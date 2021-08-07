var Manager;

(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      //solrUrl: 'https://reuters-demo.tree.ewdev.ca:9090/reuters/'
      solrUrl: 'http://192.168.3.99:8983/solr/multisite/'
      //solrUrl: 'http://dsu-fedora.utsc.utoronto.ca:8983/solr/multisite/'
      // If you are using a local Solr instance with a "reuters" core, use:
      // solrUrl: 'http://localhost:8983/solr/reuters/'
      // If you are using a local Solr instance with a single core, use:
      // solrUrl: 'http://localhost:8983/solr/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));

    var fields = ['site', 'ss_federated_terms' ];
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.MultiSelectWidget({ //MultiSelectWidget instead of Tagcloudwidget
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i],
        max_show: 10,
        max_facets: 20,
        sort_type: 'count' //possible values: 'range', 'lex', 'count'
      }));
    }

    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'ss_federated_title' ]
    }));

    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'site', 'ss_federated_terms' ],
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.site.facet.limit': 50,
      'f.countryCodes.facet.limit': -1,
      'facet.date': 'date',
      'facet.date.start': '1987-02-26T00:00:00.000Z/DAY',
      'facet.date.end': '1987-10-20T00:00:00.000Z/DAY+1DAY',
      'facet.date.gap': '+1DAY',
      'json.nl': 'map'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }

})(jQuery);
