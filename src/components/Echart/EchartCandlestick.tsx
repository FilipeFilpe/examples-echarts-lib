import { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

const upColor = "#ec0000";
const upBorderColor = "#8A0000";
const downColor = "#00da3c";
const downBorderColor = "#008F28";
const loadingOption = {
  default: {
    text: 'Carregando...',
    color: '#c23531',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0,

    // Font size. Available since `v4.8.0`.
    fontSize: 12,
    // Show an animated "spinner" or not. Available since `v4.8.0`.
    showSpinner: true,
    // Radius of the "spinner". Available since `v4.8.0`.
    spinnerRadius: 10,
    // Line width of the "spinner". Available since `v4.8.0`.
    lineWidth: 5,
    // Font thick weight. Available since `v5.0.1`.
    fontWeight: 'normal',
    // Font style. Available since `v5.0.1`.
    fontStyle: 'normal',
    // Font family. Available since `v5.0.1`.
    fontFamily: 'sans-serif'
  }
}

type DataProps = {categoryData: number[], values: number[][], volumes: number[][]}

function splitData(rawData: number[][]): DataProps {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0]);
    values.push(rawData[i]);
    volumes.push([i, rawData[i][4], rawData[i][0] > rawData[i][1] ? 1 : -1]);
  }

  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
  };
}

function calculateMA(dayCount: number, data: { values: number[][] }) {
  var result = [];
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    var sum = 0;
    for (var j = 0; j < dayCount; j++) {
      sum += data.values[i - j][1];
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

function returnOption(data: DataProps) {
  return {
    animation: false,
    legend: {
      bottom: 10,
      left: "center",
      data: ["Dow-Jones index", "MA5", "MA10", "MA20", "MA30"],
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      textStyle: {
        color: "#000",
      },
      position: function (pos: number[], params: any, el: any, elRect: any, size: { viewSize: number[]; }) {
        const obj: Record<string, number> = {
          top: 10,
        };
        obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
      label: {
        backgroundColor: "#777",
      },
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: false,
        },
        brush: {
          type: ["lineX", "clear"],
        },
      },
    },
    brush: {
      xAxisIndex: "all",
      brushLink: "all",
      outOfBrush: {
        colorAlpha: 0.1,
      },
    },
    visualMap: {
      show: false,
      seriesIndex: 5,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor,
        },
        {
          value: -1,
          color: upColor,
        },
      ],
    },
    grid: [
      {
        left: "10%",
        right: "8%",
        height: "50%",
      },
      {
        left: "10%",
        right: "8%",
        top: "63%",
        height: "16%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          z: 100,
        },
      },
      {
        type: "category",
        gridIndex: 1,
        data: data.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: [
      {
        type: "inside",
        xAxisIndex: [0, 1],
        start: 98,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: "slider",
        top: "85%",
        start: 98,
        end: 100,
      },
    ],
    series: [
      {
        name: "Dow-Jones index",
        type: "candlestick",
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        tooltip: {
          formatter: function (param: any) {
            param = param[0];
            return [
              "Date: " + param.name + '<hr size=1 style="margin: 3px 0">',
              "Open: " + param.data[0] + "<br/>",
              "Close: " + param.data[1] + "<br/>",
              "Lowest: " + param.data[2] + "<br/>",
              "Highest: " + param.data[3] + "<br/>",
            ].join("");
          },
        },
      },
      {
        name: "MA5",
        type: "line",
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA10",
        type: "line",
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA20",
        type: "line",
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "MA30",
        type: "line",
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: data.volumes,
      },
    ],
  }
}
function EchartCandlestick() {
  const [option, setOption] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  // https://echarts.apache.org/en/api.html#events
  const onEvents = {
    'click': (event: any) => console.log('CLICOU', event),
    'legendselectchanged': (event: any) => console.log('LEGENDA', event)
  }

  const returnData = async () => {
    return await fetch("../stock-dji.json")
      .then((res) => res.json())
      .then((rawData: number[][]) => {
        const data: DataProps = splitData(rawData);

        setOption(returnOption(data))
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    returnData()
  }, [])

  return (
    <ReactEcharts
      showLoading={loading}
      loadingOption={loadingOption.default}
      option={option}
      theme="dark"
      notMerge={false}
      lazyUpdate={true}
      style={{
        height: "100vh",
        width: "100vw",
      }}
      onEvents={onEvents}
    />
  );
}

export default EchartCandlestick;
