<template>
  <div>
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Legend } from 'chart.js';

export default {
  props: ['data', 'xLabel', 'yLabel'],
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
      this.createChart(ctx, plugins);
    },
    createChart(ctx, plugins) {
      Chart.register(...plugins);

      // 데이터셋에 fill: false 속성 추가
      const chartData = {
        ...this.data,
        datasets: this.data.datasets.map(dataset => ({
          ...dataset,
          fill: false
        }))
      };

      this.chart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            tooltip: {
              enabled: false,
            },
            legend: {
              display: true,
              position: 'right',
              align: 'start',
              labels: {
                padding: 20,
                boxWidth: 40
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: this.yLabel
              }
            },
            x: {
              display: true,
              title: {
                display: true,
                text: this.xLabel
              },
            },
          },
        },
      });
    },
    shouldRegisterFiller() {
      return false; // Filler 플러그인이 더 이상 필요하지 않으므로 false 반환
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