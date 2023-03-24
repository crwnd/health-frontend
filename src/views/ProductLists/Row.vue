<script setup>
import ProductCardInline from "@/components/ProductCardInline.vue";
defineProps(["providedProducts", "title"]);
defineEmits(["update:providedProducts"]);
</script>

<script>
export default {
  name: "Row",
  components: {},
  methods: {
    productUpdate(newValue) {
      this.$emit("update:providedProducts", newValue);
      return;
    },
  },
};
</script>
<template>
  <div class="portal-section liked-goods">
    <h2 class="portal-section__heading">{{ title || "?" }}</h2>
    <ul class="section-products-row">
      <ProductCardInline
        v-for="productObj in providedProducts"
        :key="productObj.id"
        :product-obj="productObj"
        @update:product-update="productUpdate"
      />
    </ul>
  </div>
</template>
