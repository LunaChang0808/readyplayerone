export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Vega Stack Plot`
)});
  main.variable(observer("embed")).define("embed", ["require"], function(require){return(
require.alias({
  "vega": "vega@5.20.0",
  "vega-lite": "vega-lite@5.0.0"
})("vega-embed@6")
)});
  main.variable(observer("viewof view2")).define("viewof view2", ["embed"], function(embed){return(
embed({
  "width": 800,
  "height": 700,
  "padding": 5,

  "signals": [
    {
      "name": "Region", "value": "all",
      "bind": {"input": "radio", "options": ["China","Japan","Korea","Taiwan","USA", "all"]}
    },
    {
      "name": "query", "value": "",
      "on": [
        {"events": "area:click!", "update": "datum.game_type"},
        {"events": "dblclick!", "update": "''"}
      ],
      "bind": {"input": "text", "placeholder": "search", "autocomplete": "off"}
    }
  ],

  "data": [
    {
      "name": "game_types",
      "url": "https://gist.githubusercontent.com/LunaChang0808/5a4970bc5fffe3ea5df5a9c888208b9b/raw/0066835bd81a0697e02167b39e2ce160be9a7d9d/p2.a_game_type_2.json",
      "format": {
        "type": "json",
        "parse": {"Month": "date:'%Y/%m'"}
      },
      "transform": [
        {
          "type": "filter",
          "expr": "(Region === 'all' || datum.Region === Region) && (!query || test(regexp(query,'i'), datum.game_type))"
        },
        {
          "type": "stack",
          "field": "perc",
          "groupby": ["Month"],
          "sort": {
            "field": ["game_type", "Region"],
            "order": ["descending", "descending"]
          }
        }
      ]
    },
    {
      "name": "series",
      "source": "game_types",
      "transform": [
        {
          "type": "aggregate",
          "groupby": ["game_type", "Region"],
          "fields": ["perc", "perc"],
          "ops": ["sum", "argmax"],
          "as": ["sum", "argmax"]
        }
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "linear",
      "range": "width",
      "zero": false, "round": true,
      "domain": {"data": "game_types", "field": "Month"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height", "round": true, "zero": true,
      "domain": {"data": "game_types", "field": "y1"}
    },
    {
      "name": "color",
      "type": "ordinal",
      "domain": ["China","Japan","Korea","Taiwan","USA"],
      "range": ["#ffcb69", "#ff7f51","#5aa9e6", "#7161ef","#8ac926"]
    },
    {
      "name": "alpha",
      "type": "linear", "zero": true,
      "domain": {"data": "series", "field": "sum"},
      "range": [0.4, 0.8]
    },
    {
      "name": "font",
      "type": "sqrt",
      "range": [0, 20], "round": true, "zero": true,
      "domain": {"data": "series", "field": "argmax.perc"}
    },
    {
      "name": "opacity",
      "type": "quantile",
      "range": [0, 0, 0, 0, 0, 0.1, 0.2, 0.4, 0.7, 1.0],
      "domain": {"data": "series", "field": "argmax.perc"}
    },
    {
      "name": "align",
      "type": "quantize",
      "range": ["left", "center", "right"], "zero": false,
      "domain": [1730, 2130]
    },
    {
      "name": "offset",
      "type": "quantize",
      "range": [6, 0, -6], "zero": false,
      "domain": [1730, 2130]
    }
  ],

  "axes": [
    {
      "orient": "bottom", "scale": "x", "formatType":"time", "format": "%y/%m", "tickCount": 20
    },
    {
      "orient": "right", "scale": "y", "format": "%",
      "grid": true, "domain": false, "tickSize": 12,
      "encode": {
        "grid": {"enter": {"stroke": {"value": "#ccc"}}},
        "ticks": {"enter": {"stroke": {"value": "#ccc"}}}
      }
    }
  ],

  "marks": [
    {
      "type": "group",
      "from": {
        "data": "series",
        "facet": {
          "name": "facet",
          "data": "game_types",
          "groupby": ["game_type", "Region"]
        }
      },

      "marks": [
        {
          "type": "area",
          "from": {"data": "facet"},
          "encode": {
            "update": {
              "x": {"scale": "x", "field": "Month"},
              "y": {"scale": "y", "field": "y0"},
              "y2": {"scale": "y", "field": "y1"},
              "fill": {"scale": "color", "field": "Region"},
              "fillOpacity": {"scale": "alpha", "field": {"parent": "sum"}}
            },
            "hover": {
              "fillOpacity": {"value": 0.2}
            }
          }
        }
      ]
    },
    {
      "type": "text",
      "from": {"data": "series"},
      "interactive": false,
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "argmax.Month"},
          "dx": {"scale": "offset", "field": "argmax.Month"},
          "y": {"signal": "scale('y', 0.5 * (datum.argmax.y0 + datum.argmax.y1))"},
          "fill": {"value": "#000"},
          "fillOpacity": {"scale": "opacity", "field": "argmax.perc"},
          "fontSize": {"scale": "font", "field": "argmax.perc", "offset": 5},
          "text": {"field": "game_type"},
          "align": {"scale": "align", "field": "argmax.Month"},
          "baseline": {"value": "middle"}
        }
      }
    }
  ]
})
)});
  main.variable(observer("view2")).define("view2", ["Generators", "viewof view2"], (G, _) => G.input(_));
  return main;
}
