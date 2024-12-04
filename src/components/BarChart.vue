<template>
  <div>
    <canvas ref="barChartCanvas"></canvas>
  </div>
</template>

<script>
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

export default {
  props: ["data", "xLabel", "yLabel", "useDoubleYAxis"],
  mounted() {
    this.renderChart();
  },
  watch: {
    data() {
      this.renderChart();
    },
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.barChartCanvas.getContext("2d");

      const plugins = [
        BarController,
        BarElement,
        CategoryScale,
        LinearScale,
        Title,
        Tooltip,
        Legend,
      ];
      if (this.shouldRegisterFiller()) {
        import("chart.js/auto").then((chartModule) => {
          const Filler = chartModule.Filler;
          plugins.push(Filler);
          this.createChart(ctx, plugins);
        });
      } else {
        this.createChart(ctx, plugins);
      }
    },
    createChart(ctx, plugins) {
      Chart.register(...plugins);

      const scalesOption = this.useDoubleYAxis ? {
        'y-axis-1': {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: '펀딩 수'
          }
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: '펀딩 수익 (만원)'
          },
          grid: {
            drawOnChartArea: false
          },
          display: true
        },
        x: {
          title: {
            display: true,
            text: this.xLabel,
          }
        }
      } : {
        x: {
          title: {
            display: true,
            text: this.xLabel,
          }
        },
        y: {
          title: {
            display: true,
            text: this.yLabel,
          }
        }
      };

      this.chart = new Chart(ctx, {
        type: "bar",
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: true,
              position: "right",
              align: "start",
              labels: {
                padding: 20,
                boxWidth: 40,
              },
            },
          },
          scales: scalesOption
        },
      });
    },
    shouldRegisterFiller() {
      return this.data && this.data.datasets.some((dataset) => dataset.fill);
    },
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 300px;
}
</style>