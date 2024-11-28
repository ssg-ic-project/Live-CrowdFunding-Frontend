<template>
  <div>
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Legend, Filler} from 'chart.js';
// import Chart from 'chart.js/auto';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, CategoryScale, Legend, Filler);

export default {
  props: ['data'],
  mounted() {
    new Chart(this.$refs.lineChartCanvas, {
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
        scales: {                // 스케일 옵션 추가
          y: {
            beginAtZero: true,   // y축을 0부터 시작
          },
          x: {
            display: true,
            title: {
              display: true,
            }
          }
        }
/////

      },
    });
  },
};
</script>

<style scoped>
canvas {
  max-width: 100%;
  height: 300px;
}
</style>
