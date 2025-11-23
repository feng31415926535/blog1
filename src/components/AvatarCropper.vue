<template>
  <div class="avatar-cropper">
    <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" class="avatar-input">
    <button @click="triggerFileInput" class="select-image-btn">选择图片</button>
    <div v-if="showCropper" class="cropper-modal">
      <div class="cropper-container">
        <div class="modal-header">
          <h3 class="modal-title">裁剪头像</h3>
          <button @click="showCropper = false" class="close-btn">×</button>
        </div>
        <vue-cropper
          ref="cropper"
          :src="imageUrl"
          :auto-crop-area="0.8"
          :aspect-ratio="1"
          view-mode="1"
          guides
          center-box
          :style="{ height: '300px' }"
        ></vue-cropper>
        <div class="cropper-buttons">
          <button @click="showCropper = false" class="cancel-btn">取消</button>
          <button @click="cropImage" class="confirm-btn">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted, nextTick } from 'vue';
import VueCropper from 'vue-cropperjs';

export default {
  components: {
    VueCropper
  },
  emits: ['avatar-cropped'],
  setup(props, { emit }) {
    const imageUrl = ref('');
    const showCropper = ref(false);
    const cropper = ref(null);
    const fileInput = ref(null);

    const triggerFileInput = () => {
    fileInput.value.click();
  };

      const prevBlobUrl = ref('');

      const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          // 验证图片是否能成功加载
          const img = new Image();
          const tempUrl = URL.createObjectURL(file);
          
          img.onload = () => {
            // 图片加载成功后再处理
            try {
              // 使用微任务队列确保DOM更新完成
              Promise.resolve().then(() => {
                // 先撤销之前的blob URL
                if (prevBlobUrl.value) {
                  console.log('撤销之前的blob URL:', prevBlobUrl.value);
                  URL.revokeObjectURL(prevBlobUrl.value);
                }
                
                const blobUrl = URL.createObjectURL(file);
                prevBlobUrl.value = blobUrl;
                // 确保组件已渲染
                nextTick(() => {
                  imageUrl.value = blobUrl;
                  showCropper.value = true;
                  console.log('图片加载成功，已创建blob URL:', blobUrl);
                });
              });
            } catch (error) {
              console.error('处理图片URL时出错:', error);
            } finally {
              // 撤销临时URL
              URL.revokeObjectURL(tempUrl);
            }
          };
          // 添加图片加载超时处理
          img.timeoutId = setTimeout(() => {
            img.onerror();
            console.error('图片加载超时');
          }, 10000);
          img.onerror = (error) => {
            console.error('图片加载失败:', error);
            URL.revokeObjectURL(tempUrl);
          };
          img.src = tempUrl;
        }
      };

      // 组件卸载时撤销blob URL
      onUnmounted(() => {
        if (prevBlobUrl.value) {
          URL.revokeObjectURL(prevBlobUrl.value);
        }
      });

    const cropImage = () => {
      if (!cropper.value || !prevBlobUrl.value) {
        console.error('裁剪组件未初始化或图片URL无效');
        return;
      }
      try {
        const canvas = cropper.value.getCroppedCanvas();
        if (!canvas) {
          console.error('无法获取裁剪区域');
          showCropper.value = false;
          return;
        }
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('无法创建图片Blob');
            showCropper.value = false;
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            emit('avatar-cropped', event.target.result);
            showCropper.value = false;
          };
          reader.onerror = (error) => {
            console.error('图片读取失败:', error);
            showCropper.value = false;
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('裁剪过程出错:', error);
        showCropper.value = false;
      }
    };

    return {
      imageUrl,
      showCropper,
      cropper,
      fileInput,
      onFileChange,
      cropImage,
      triggerFileInput
    };
  }
};
</script>

<style>
</style>

<style scoped>
.select-image-btn {
  margin-bottom: 15px;
  padding: 8px 16px;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: auto;
}

.select-image-btn:hover {
  background-color: #359469;
}
.avatar-input {
  display: none;
}

.cropper-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000000 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  overflow: hidden;
  opacity: 1 !important;
  /* 添加额外的背景层确保不透明 */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    z-index: -1;
  }
}

.cropper-container {
      background-color: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 90%;
      width: 500px;
      max-height: 80vh;
      overflow: auto;
      box-sizing: border-box;
      margin: 0 auto;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
      border: none;
    }

.cropper-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}

.cancel-btn {
  background-color: #f5f5f5;
  color: #333;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .cropper-container,
.modal-leave-to .cropper-container {
  transform: scale(0.9);
  opacity: 0;
}

.confirm-btn {
  background-color: #42b883;
  color: white;
  opacity: 1;
  pointer-events: auto;
}
</style>