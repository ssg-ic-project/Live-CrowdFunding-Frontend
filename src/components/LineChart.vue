<template>
  <div>
    <canvas ref="lineChartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip);

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
