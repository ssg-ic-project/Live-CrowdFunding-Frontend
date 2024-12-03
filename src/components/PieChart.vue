<template>
  <div>
    <canvas ref="pieChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, PieController, ArcElement, Legend, Title, Tooltip} from 'chart.js';

export default {
  props: ['data'],
  mounted() {
    this.renderChart();
  },
  watch: {
    data() {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.pieChartCanvas.getContext('2d');
      const plugins = [ArcElement, PieController, Legend, Title, Tooltip];
      this.createChart(ctx, plugins);
    },
    createChart(ctx, plugins) {
      Chart.register(...plugins);

      this.chart = new Chart(ctx, {
        type: 'pie',
        data: this.data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              align: 'center',
              labels: {
                padding: 20,
                boxWidth: 40
              }
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 300px;
}
</style>