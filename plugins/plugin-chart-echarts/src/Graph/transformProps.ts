import { EchartsProps } from '../types';

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

export default function transformProps(chartProps){
    const {width, height, formData, queriesData }= chartProps;
    const data = queriesData[0].data || [];

    console.log("data in transformprops ", data);
    var categories = [];

    var input_data = 
    [
        {source: 'agri', target: 'Carbon', sum_value: 1.4},
        {source: 'agri', target: 'soil', sum_value: 5.2}
    ]

    var echart_raw_data = {
        "nodes": [
          {
            "id": "0",
            "name": "Myriel",
            "symbolSize": 19.12381,
            "x": -266.82776,
            "y": 10.6904,
            "value": 28.685715,
            
          },
          {
            "id": "1",
            "name": "Napoleon",
            "symbolSize": 2.6666666666666665,
            "x": -418.08344,
            "y": 446.8853,
            "value": 4,
            
          }
        ],
        "links": [
            {
              "source": "1",
              "target": "0"
            },
        ],
    }

    var nodes ={};
    //var width = 960;
    //var height = 500;
    var index = 0;
    
    //convert data for echart
    var nodes = {}; //{agri: 0, carbon: 1}
    var echart_nodes = [] // [{id,name,symbol,x,y,value} , {}]
    var echart_links = [] // [{source, target}, {}]
    var index = 0;
    var source_index = 0;
    var target_index = 0;
    data.forEach(link => {
        
        const source = link.source;
        const target = link.target;
        if (!(source in nodes)){
            echart_nodes.push(
                {
                    id: index, 
                    name: source, 
                    value: link.value, 
                    symbolSize:link.value,
                    x: randomIntFromInterval(-200, 100),
                    y: randomIntFromInterval(-200, 100),
                })
            source_index = index
            nodes[source] = index
            index += 1;
        }
        else{
            console.log("in else")
            //source_index = nodes.source
            //echart_nodes[source_index].symbolSize += link.value
        }

        if (!(target in nodes)){
            echart_nodes.push({
                id: index, 
                name: target, 
                value: link.value, 
                symbolSize:link.value * 2,
                x: randomIntFromInterval(-200, 100),
                y: randomIntFromInterval(-200, 100),
            })
            target_index = index
            nodes[target] =  index
            index += 1;
        }
        else{
            //target_index = nodes.target
            //echart_nodes[target_index].symbolSize += link.value
        }
        echart_links.push({source: source_index.toString(), target: target_index.toString()})
    }
    //console.log("echart nodes ", echart_nodes);
    //console.log("echart links ", echart_links);

    //decide to show label for each node
    echart_nodes.forEach(function (node) {
        node.label = {
            show: node.symbolSize > 2
        };
    });

    const echartOptions = {
        title: {
            text: 'Les Miserables',
            subtext: 'Default layout',
            top: 'bottom',
            left: 'right'
        },
        tooltip: {},
        
        animationDuration: 1500,
        animationEasingUpdate: 'quinticInOut',
        series: [
            {
                name: 'Les Miserables',
                type: 'graph',
                layout: 'none',
                data: echart_nodes,
                links: echart_links,
                layout: 'force',
                roam: true,
                draggable: true,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 10
                    }
                }
            }
        ]
    };

    return {
        width,
        height,
        echartOptions
    }

}



































