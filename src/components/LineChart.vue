<template>
  <div>
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Legend } from 'chart.js';

export default {
  props: ['data'],
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

      const ctx = this.$refs.lineChartCanvas.getContext('2d');

      const plugins = [LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Legend];
      if (this.shouldRegisterFiller()) {
        import('chart.js/auto').then((chartModule) => {
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
        type: 'line',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: true,
              mode: 'index',
              intersect: false,
              position: 'nearest',
              yAlign: 'top',
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
            x: {
              display: true,
              title: {
                display: true,
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