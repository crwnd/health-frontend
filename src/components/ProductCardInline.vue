<script setup>
defineProps(["productObj"]);
defineEmits(["update:productUpdate"]);
</script>
<script>
export default {
  created() {
    console.log("productObj", this.productObj);
  },
};
</script>
<template>
  <li
    class="product-card portal-section-item product-card-ingrid"
    :class="productObj.liked ? 'liked' : ''"
    :data-id="productObj.id"
  >
    <RouterLink :to="'/product/' + productObj.id + '/0'">
      <div class="product-card__image">
        <img
          class="product-card__mainimage"
          v-if="productObj.bundles"
          :src="productObj.bundles[0].images[0]"
          alt="Product main image"
        />
      </div>
      <div class="portal-section-item-info">
        <span class="portal-section-item-info-name">{{
          productObj.bundles[0].name
        }}</span>
        <div class="portal-section-item-crossed-price">
          <span class="amount">150</span>
          <span class="curency">₴</span>
        </div>
        <div class="portal-section-item-info-price">
          <span class="amount">120</span>
          <span class="curency">₴</span>
        </div>
      </div>
    </RouterLink>
    <div class="product-card-actions">
      <button
        class="product-card-like-btn"
        @click="
          $emit(
            'update:productUpdate',
            Object.assign({}, productObj, {
              liked: !productObj.liked,
            })
          )
        "
      >
        <svg class="product-card-like-btn-empty">
          <use xlink:href="/svgs/icons.svg?002#icon-heart-empty"></use>
        </svg>
        <svg class="product-card-like-btn-full">
          <use xlink:href="/svgs/icons.svg?002#icon-heart-full"></use>
        </svg>
      </button>
    </div>
  </li>
</template>

<style scoped>
.product-card-actions svg {
  width: 18px;
  height: 18px;
}
.product-card-ingrid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% / 8);
  padding: 16px;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  border-right: 1px solid var(--divider-color);
}

.product-card-ingrid a {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: inherit;
}

.product-card-in-list a:hover {
  text-decoration: none;
}

.product-card-ingrid:hover .portal-section-item-info-name {
  color: #005bff;
}

.product-card-ingrid .product-card__image {
  width: 100%;
  height: 150px;
  position: relative;
  display: block;
  margin-bottom: 16px;
  text-align: center;
}

.product-card__mainimage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 140px;
  max-width: 100%;
}

.product-card-actions {
  width: 32px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  position: absolute;
  top: 6px;
  right: 8px;
  z-index: 5;
}

.product-card-actions button {
  width: 32px;
  min-width: 32px;
  height: 32px;
  display: flex;
  margin: 2px 0;
  padding: 0;
  background-color: var(--btns-bg);
  justify-content: center;
  align-items: center;
}

.product-card.liked .product-card-like-btn-empty,
.product-card .product-card-like-btn-full {
  display: none;
}

.product-card.liked .product-card-like-btn-full,
.product-card .product-card-like-btn-empty {
  display: block;
}

.product-card.liked .product-card-like-btn-full {
  color: var(--accent-color);
}
@media screen and (max-width: 1600px) {
  .product-card-ingrid {
    width: calc(100% / 6);
  }
}

@media screen and (max-width: 1024px) {
  .product-card-ingrid {
    width: 25%;
  }
}
@media screen and (max-width: 768px) {
  .product-card-ingrid {
    width: 50%;
  }
}
</style>
