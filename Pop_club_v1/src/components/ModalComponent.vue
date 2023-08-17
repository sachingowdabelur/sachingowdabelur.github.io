<template>
    <div class="modal-mask">
        <div class="modal-wrapper">
            <div class="modal-container">
                <div class="modal-header">
                    <slot name="header">
                        default header
                    </slot>
                    <button data-v-450c6891="" type="button" class="btn-close" @click="$emit('close')"></button>
                </div>

                <div class="modal-body">
                    <slot name="body">
                        default body
                    </slot>
                </div>

                <div class="modal-footer">
                    <slot name="footer">
                        default footer
                        <button class="modal-default-button" @click="$emit('close')">
                            OK
                        </button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "ModalComponent",
    methods: {
        hide() {
            this.$emit('close')
        }
    }
}
</script>

<style>
.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000080;
    display: table;
    transition: opacity .3s ease
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle
}

.modal-container {
    width: 600px;
    margin: 0 auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px #00000054;
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif
}

.modal-header h4 {
    margin-top: 0;
    color: #e76528
}

.modal-body {
    margin: 5px 0;
    min-height: 30vh;
    max-height: 60vh;
    overflow-y: auto
}

.sec-uploader {
    color: #e76528;
    overflow-y: auto
}

.modal-default-button {
    float: right
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center; 
  justify-content: flex-end; 
  padding: 5px;
  border-top: 1px solid #dee2e6;

  > * {
    margin: 4%;
  }
}

.btn-close {
    box-sizing: content-box;
    width: 0.75em;
    height: 0.75em;
    padding: 0.25em;
    background: transparent url(https://www.pngfind.com/pngs/m/90-904785_png-file-svg-close-button-icon-png-transparent.png) center/1em auto no-repeat;
    border: 0;
    border-radius: 0.375rem;
    opacity: .5;
}

.btn-confirm {
  min-width: 100px;
  border-radius: 5%;
  margin: 1px;
  background: #e76528;
  color: #fff;
  border: none;
  padding: 0 5px;
  margin-right: 5px;
}

.btn-clear {
  color: #fff;
  background: #aa9287;
  border: 1px solid #dad8d8;
  border-radius: 5%;
  min-width: 100px;
  margin-left: 5px;
}
</style>