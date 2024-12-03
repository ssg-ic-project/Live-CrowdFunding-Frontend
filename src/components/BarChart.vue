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
  props: ["data", "xLabel", "yLabel"],
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
          scales: {
            x: {
              title: {
                display: true,
                text: this.xLabel,
              },
            },
            y: {
              title: {
                display: true,
                text: this.yLabel,
              },
            },
          },
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
