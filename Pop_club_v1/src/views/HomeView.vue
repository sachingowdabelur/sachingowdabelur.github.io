<template>
  <div id="home-page">
    <div class="row hdr-title">
      <div class="col-12" style="text-align: center;">
        <h2 data-v-63d42fc0="">Catalogue Images</h2>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <form role="form" class="align-row">
          <div class="mb-3 drag-list">
            <input id="vskcode" type="text" placeholder="Vendor Sku code" v-model="initialFilters.vendor_sku_code">
          </div>
          <div class="mb-3 drag-list" style="margin-left: 4%;">
            <input id="vskstyle" type="text" placeholder="Vendor Style code" v-model="initialFilters.vendor_style_code">
          </div>
          <div class="mb-3 drag-list" style="margin-left: 4%;">
            <input id="vsbrand" type="text" placeholder="Brand" v-model="initialFilters.brand">
          </div>
          <div class="mb-3 drag-list" style="margin-left: 4%;">
            <p style="margin: 3px;">Validation Status :</p>
            <select>
              <option value=initialFilters.validation_status>True</option>
              <option value=!initialFilters.validation_status>False</option>
            </select>
          </div>
          <div class="mb-3 drag-list" style="margin-left: 4%;">
            <button type="button" class="btn-search" @click=getAllCatalogs> Search </button>
          </div>
          <div class="mb-3 drag-list" style="margin-left: 4%;">
            <button type="button" class="btn-search" @click=uplodProduct> Upload Product </button>
          </div>
        </form>
      </div>
    </div>
    <EasyDataTable :headers="headers" :items="catalogList" :theme-color="themeColor" buttons-pagination>
      <template #item-images="{ images, vendor_style_code, id }">
        <div style="overflow-x: auto;">
          <draggable class="drag-list" :list="images" @change="shuffleCatalogueInfo($event, vendor_style_code)">
            <div v-for="image in images" class="img-card">
              <photo-consumer :key="image.s3_path" :src="image.s3_path">
                <img :src="image.s3_path" class="view-box">
                <div>
                  <button type="button" class="btn-trash vs" @click="confirmDelete(image, id)"></button>
                  <button type="button" class="btn-reload vs" @click="reUploadProduct(image, vendor_style_code)"></button>
                </div>
              </photo-consumer>
            </div>
          </draggable>
        </div>
      </template>
      <template #item-image_validation_status="{ image_validation_status, id }">
        <input type="checkbox" id=id value=image_validation_status
          @click="updateCatalogInfo(image_validation_status, id)">
      </template>
    </EasyDataTable>
    <transition name="modal">
      <modal-component v-if="showModal" @close="showModal = false">
        <template v-slot:header>
          <h4>{{ dynamicHeader }}</h4>
        </template>
        <template v-slot:body>
          <div v-if="uploadModalFlag">
            <div class="row">
              <div class="col-md-6">
                Select File :
              </div>
              <div class="col-md-6">
                <input type="file" />
              </div>
            </div>
          </div>

          <div v-if="deleteModalFlag">
            <div class="row">
              <div class="col-md-12">
                Are you sure want to delete ?
              </div>
            </div>
          </div>
          <div v-if="reUploadModalFlag">
            <div class="row">
              <div class="col-md-6">
                Vendor Style Code :
              </div>
              <div class="col-md-6">
                <input type="text" v-model="reUploadeObj.vendor_style_code" disabled/>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                Display Order :
              </div>
              <div class="col-md-6">
                <input type="text" v-model="reUploadeObj.display_order" disabled/>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                Select File :
              </div>
              <div class="col-md-6">
                <input type="text" v-model="reUploadeObj.image_path"/>
                <input type="file" />
              </div>
            </div>
          </div>
        </template>
        <template v-slot:footer>
          <div v-if="uploadModalFlag">
            <button type="button" class="btn-clear" @close=close> Cancel </button>
            <button type="button" class="btn-confirm" @close=close> Upload </button>
          </div>
          <div v-if="deleteModalFlag">
            <button type="button" class="btn-clear" @close=close> No, Cancel </button>
            <button type="button" class="btn-confirm" @deleteImageOrder=deleteImageOrder> Yes, Confirm </button>
          </div>
          <div v-if="reUploadModalFlag">
            <button type="button" class="btn-clear" @close=close> Cancel </button>
            <button type="button" class="btn-confirm" @close=close> Re-Upload </button>
          </div>
        </template>
      </modal-component>
    </transition>
  </div>
</template>

<script setup lang="ts">
import type { Header, Item } from "vue3-easy-data-table";
import ApiDataService from "@/services/ApiDataService";
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import ModalComponent from "../components/ModalComponent.vue";

const themeColor = "#f48225";

const headers: Header[] = [
  { text: "Sl NO", value: "id" },
  { text: "Brand", value: "brand", sortable: true },
  { text: "Vendor Sku Code", value: "vendor_sku_code", sortable: true },
  { text: "Vendor style Code", value: "vendor_style_code", sortable: true },
  { text: "Images", value: "images", sortable: true },
  { text: "Color", value: "color", sortable: false },
  { text: "Size", value: "size", sortable: true },
  { text: "Validation", value: "image_validation_status", sortable: true }
];

// let catalogList: Item[] = [
//   {
//     "id": 177,
//     "images": [
//       {
//         "display_order": 0,
//         "s3_path": ""
//       },
//       {
//         "display_order": 1,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-41-XS_HL-HS-41_1_20230629_115732.jpg"
//       },
//       {
//         "display_order": 2,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-41-XS_HL-HS-41_2_20230629_115733.jpg"
//       },
//       {
//         "display_order": 3,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-41-XS_HL-HS-41_3_20230629_115734.jpg"
//       },
//       {
//         "display_order": 4,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-41-XS_HL-HS-41_4_20230629_115735.jpg"
//       },
//       {
//         "display_order": 5,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-41-XS_HL-HS-41_5_20230629_115736.jpg"
//       },
//       {
//         "display_order": 6,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-41-XS_HL-HS-41_6_20230629_115737.jpg"
//       }
//     ],
//     "brand": "HILO DESIGN",
//     "vendor_sku_code": "HL-HS-41-XS",
//     "vendor_style_code": "HL-HS-41",
//     "title": "Float Full Sleeve Light Blue Casual Shirt",
//     "color": null,
//     "size": null,
//     "image_validation_status": false,
//     "image_upload_status": "success"
//   },
//   {
//     "id": 171,
//     "images": [
//       {
//         "display_order": 0,
//         "s3_path": ""
//       },
//       {
//         "display_order": 1,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-40-XS_HL-HS-40_1_20230629_115652.jpg"
//       },
//       {
//         "display_order": 2,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-40-XS_HL-HS-40_2_20230629_115653.jpg"
//       },
//       {
//         "display_order": 3,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-40-XS_HL-HS-40_3_20230629_115654.jpg"
//       },
//       {
//         "display_order": 4,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-40-XS_HL-HS-40_4_20230629_115655.jpg"
//       },
//       {
//         "display_order": 5,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-40-XS_HL-HS-40_5_20230629_115656.jpg"
//       },
//       {
//         "display_order": 6,
//         "s3_path": "https://d2mn6xhg96epkm.cloudfront.net/media/compressed-images/HL-HS-40-XS_HL-HS-40_6_20230629_115657.jpg"
//       }
//     ],
//     "brand": "HILO DESIGN",
//     "vendor_sku_code": "HL-HS-40-XS",
//     "vendor_style_code": "HL-HS-40",
//     "title": "Distorted Full Sleeve Black Casual Shirt",
//     "color": null,
//     "size": null,
//     "image_validation_status": false,
//     "image_upload_status": "success"
//   }
// ];

const catalogList = ref([]);
const initialFilters = ref({
  "validation_status": false,
  "brand": "",
  "vendor_sku_code": "",
  "vendor_style_code": ""
});
const showModal = ref(false);
const uploadModalFlag = ref(false);
const reUploadModalFlag = ref(false);
const deleteModalFlag = ref(false);
const selectedDeleteObj = ref({
  "display_order": "",
  "product_id": 0
});

const reUploadeObj = ref({
  "display_order": "",
  "vendor_style_code": "",
  "image_path": "",
  "raw_image": ""
});
const initialize = () => {
  getAllCatalogs();
};

const dynamicHeader = ref("");
const selectedFile = ref("");

onMounted(() => initialize());

//Added to get list all catalog info.
function getAllCatalogs() {
  let queryParam = new URLSearchParams();
  queryParam.append('validation_status', initialFilters.value.validation_status ? "true" : "false");
  queryParam.append('brand', initialFilters.value.brand);
  queryParam.append('vendor_sku_code', initialFilters.value.vendor_sku_code);
  queryParam.append('vendor_style_code', initialFilters.value.vendor_style_code);

  ApiDataService.getAll(queryParam)
    .then(response => {
      catalogList.value = response.data.data;
    })
    .catch(e => {
      console.log(e);
      toast.error(e);
    });
}

function updateCatalogInfo(validationStats: boolean, productId: number) {
  let updateQueryObj = {
    "validation_status": !validationStats,
    "product_id": productId
  };
  ApiDataService.update(updateQueryObj)
    .then(response => {
      let stats = response.data.data;
      toast.success(stats.message);
      getAllCatalogs();
    })
    .catch(e => {
      toast.error(e);
    });
}

function shuffleCatalogueInfo(event: any, vendorCode: string) {
  let shuffleOrderObj = {
    "vendor_style_code": vendorCode,
    "destination_display_order": event.moved.newIndex,
    "current_display_order": event.moved.oldIndex
  };
  ApiDataService.updateShuffle(shuffleOrderObj)
    .then(response => {
      let stats = response.data.data;
      toast.success(stats.message);
      //getAllCatalogs();
    })
    .catch(e => {
      toast.error(e);
    });
}

function reUploadProduct(image: any, vendorStyle: string) {
  showModal.value = true;
  deleteModalFlag.value = false;
  uploadModalFlag.value = false;
  reUploadModalFlag.value = true;
  dynamicHeader.value = "Re-Upload Image"
  reUploadeObj.value.display_order = image.display_order;
  reUploadeObj.value.vendor_style_code = vendorStyle;
}

function uplodProduct() {
  showModal.value = true;
  uploadModalFlag.value = true;
  deleteModalFlag.value = false;
  reUploadModalFlag.value = false;
  dynamicHeader.value = "Upload New Product"
}

function confirmDelete(image: any, productId: number) {
  showModal.value = true;
  deleteModalFlag.value = true;
  uploadModalFlag.value = false;
  reUploadModalFlag.value = false;
  dynamicHeader.value = "Delete Image"
  selectedDeleteObj.value.display_order = image.display_order;
  selectedDeleteObj.value.product_id = productId;
}

function deleteImageOrder() {
  if (selectedDeleteObj.value.display_order != "") {
    ApiDataService.delete(selectedDeleteObj)
      .then(response => {
        let stats = response.data.data;
        toast.success(stats.message);
        getAllCatalogs();
      })
      .catch(e => {
        toast.error(e);
      });
  }
}

function close(){
  showModal.value = false;
  deleteModalFlag.value = false;
  uploadModalFlag.value = false;
  reUploadModalFlag.value = false;
}

</script>

<style>
/* @media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
} */
/* .main-container {
  padding: 2rem;
} */

.hdr-title {
  margin-bottom: 20px;
  background: #e76528;
  padding: 1%;
}

.align-row {
  display: flex;
}

.drag-list {
  display: inline-flex;
  text-align: center;
  cursor: pointer;
  overflow-x: auto;
}

img {
  width: calc(4rem + 32px);
  height: 70px;
  margin: 5px 10px;
  display: block;
}

.img-card {
  border-radius: 5px;
  margin: 4px;
  background: #f3e3e3;
  flex-direction: row;
  display: inline-flex;
}

.btn-search {
  min-width: 100px;
  border-radius: 5%;
  margin: 1px;
  background: #e76528;
  color: #fff;
  border: none;
  padding: 0 5px
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

.btn-reload {
  box-sizing: content-box;
  width: .75em;
  height: .75em;
  padding: .5em;
  color: #272222;
  background: transparent url(https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/OOjs_UI_icon_reload.svg/1200px-OOjs_UI_icon_reload.svg.png) center/1em auto no-repeat;
  border: 0;
  border-radius: .375rem;
  opacity: .5
}

.btn-trash {
  box-sizing: content-box;
  width: .75em;
  height: .75em;
  padding: .5em;
  color: #fa3030;
  background: transparent url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2_xNuGVxA9r_neRCP-2v4vNWVdf0kC0fX8NR0gTg&s) center/1em auto no-repeat;
  border: 0;
  border-radius: .375rem;
  opacity: .5
}
</style>
