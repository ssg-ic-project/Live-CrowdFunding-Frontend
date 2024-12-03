import { ref } from 'vue'

export const useScreenRecording = () => {
  const mediaRecorder = ref(null)
  const recordedChunks = ref([])
  const isRecording = ref(false)

  const VITE_API_SERVER_URI = import.meta.env.VITE_API_SERVER_URI

  const startRecording = async (scheduleId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      mediaRecorder.value = new MediaRecorder(stream)
      recordedChunks.value = []

      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.value.push(e.data)
        }
      }

      mediaRecorder.value.onstop = () => {
        console.log('Recording stopped:', recordedChunks.value)
        uploadToNCP(scheduleId)
      }

      mediaRecorder.value.start()
      isRecording.value = true
    } catch (error) {
      console.error('Error starting recording:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder.value && isRecording.value) {
      mediaRecorder.value.stop()
      mediaRecorder.value.stream.getTracks().forEach((track) => track.stop())
      isRecording.value = false
    }
  }

  const uploadToNCP = async (scheduleId) => {
    try {
      const blob = new Blob(recordedChunks.value, { type: 'video/webm' })
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' })

      console.log('Uploading recording:', file.name)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('scheduleId', scheduleId) // scheduleId 추가

      const response = await fetch(`${VITE_API_SERVER_URI}/api/recordings`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      console.log('Recording uploaded:', data.mediaUrl) // objectUrl -> mediaUrl
    } catch (error) {
      console.error('Upload error:', error)
    }
  }

  return {
    isRecording,
    startRecording,
    stopRecording,
  }
}
