<script setup>
defineProps(["modelValue", "name", "codename", "list"]);
defineEmits(["update:modelValue", "update:product"]);
</script>

<template>
  <div
    id="modal-cart-window"
    class="modal-window modalable"
    :class="{
      hidden: modelValue !== codename,
      empty: !list || !list.length > 0,
    }"
    @click="$emit('update:modelValue', undefined)"
  >
    <div id="modal-cart" class="modal-content" @click.stop="">
      <div id="modal-cart__header" class="modal-content__header">
        <h2 id="modal-cart__header__title">{{ name }}</h2>
        <button
          id="modal-cart__header__close"
          class="close-modal modal-content__header__close"
          @click="$emit('update:modelValue', undefined)"
        >
          <svg>
            <use xlink:href="/svgs/icons.svg?002#close-outline"></use>
          </svg>
        </button>
      </div>
      <div class="modal-content__shows-on-loading">
        <span class="spinner spinner-slow"></span>
        <span>Wait, loading your goods from cart ...</span>
      </div>
      <ul
        id="modal-cart__content__categories-list"
        class="modal-content__shows-on-unempty"
      >
        <li
          v-for="product in list"
          class="product-card product-card-in-list"
          :class="{ liked: product.liked, carted: product.carted }"
          :data-id="product.id"
          data-bundleid="0"
        >
          <RouterLink :to="'/product/' + product.id + '/0'">
            <div class="product-card-in-list__image">
              <img
                class="product-card-in-list__mainimage"
                :src="product.bundles[0].images[0]"
                alt="Product main image"
              />
            </div>
            <div class="product-card-in-list__info">
              <span class="product-card-in-list__info__name">{{
                product.bundles[0].name
              }}</span>
              <span class="product-card-in-list__info__bundleInfo"
                ><span>64gb</span></span
              >
              <div class="product-card-in-list__info__crossed-price">
                <span class="amount">150</span>
                <span class="curency">₴</span>
              </div>
              <div class="product-card-in-list__info__price">
                <span class="amount">120</span>
                <span class="curency">₴</span>
              </div>
            </div>
          </RouterLink>
          <div class="product-card-in-list__actions">
            <button
              class="product-card-in-list__action product-card-in-list__actions__like-btn smallerOnHover"
              @click="
                $emit(
                  'update:product',
                  Object.assign({}, product, {
                    liked: !product.liked,
                  })
                )
              "
            >
              <svg
                class="product-card-in-list__actions__unlike-btn-empty not-in-liked"
              >
                <use
                  xlink:href="/svgs/icons.svg?002#icon-heart-empty"
                ></use>
              </svg>
              <svg
                class="product-card-in-list__actions__unlike-btn-empty in-liked"
              >
                <use
                  xlink:href="/svgs/icons.svg?002#icon-heart-full"
                ></use>
              </svg>
              <span class="in-liked">Unlike</span>
              <span class="not-in-liked">Like</span>
            </button>
            <button
              class="product-card-in-list__action product-card-in-list__actions__add-to-cart-btn smallerOnHover"
              @click="
                $emit(
                  'update:product',
                  Object.assign({}, product, {
                    carted: !product.carted,
                  })
                )
              "
            >
              <svg
                class="product-card-in-list__actions__add-to-cart not-in-cart"
              >
                <use xlink:href="/svgs/icons.svg?002#cart"></use>
              </svg>
              <svg class="product-card-in-list__actions__added-to-cart in-cart">
                <use
                  xlink:href="/svgs/icons.svg?002#trash-outline"
                ></use>
              </svg>
              <span class="not-in-cart">Add again</span>
              <span class="in-cart">Remove</span>
            </button>
          </div>
          <div class="product-card-in-list__info__quantity">
            <button
              class="product-card-in-list__info__quantity__reduce-btn"
            >
              -
            </button>
            <input
              type="number"
              value="1"
              min="1"
              max="999"
              class="amount"
            />
            <button
              class="product-card-in-list__info__quantity__add-btn"
            >
              +
            </button>
          </div>
        </li>
      </ul>
      <div class="modal-content__bottom-sticky modal-content__shows-on-unempty">
        <!-- Price and pay btn -->
        <div class="modal-cart__content__bottom-content__first">
          <span>Total:</span>
          <span>135 UAH</span>
        </div>
        <div class="modal-cart__content__bottom-content__second">
          <a href="/cart.php">
            <button class="smallerOnHover primary">Proceed to Checkout</button>
          </a>
        </div>
      </div>
      <div class="modal-content__shows-on-empty">
        <svg>
          <use xlink:href="/svgs/icons.svg?002#bag-outline"></use>
        </svg>
        <span>You haven't added to cart any products yet</span>
        <a href="/">
          <button class="smallerOnHover">Find something</button>
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-content__shows-on-unempty {
  width: 100%;
  /* height: 100%; */
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  list-style: none;
}
.modal-window .modal-content__shows-on-unempty,
.modal-window.empty .modal-content__shows-on-empty {
  display: flex;
}

.modal-window.empty .modal-content__shows-on-unempty,
.modal-window .modal-content__shows-on-empty,
.modal-window.loading .modal-content__shows-on-empty,
.modal-window.empty ul {
  display: none;
}
.product-card-in-list {
  width: calc(100% - 24px);
  max-width: 650px;
  min-height: 108px;
  display: block;
  padding: 0;
  margin: 9px;
  position: relative;
  background: var(--modal-list-elem-bg);
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  z-index: 115;
}

.product-card-in-list a {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  padding: 7px;
}
.product-card-in-list a:hover {
  text-decoration: none;
}
.product-card-in-list__image {
  width: 90px;
  height: 90px;
  position: relative;
  margin-right: 18px;
  flex-shrink: 0;
}

.product-card-in-list__mainimage {
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: #fff;
  overflow: hidden;
}

.product-card-in-list__info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  padding-bottom: 32px;
  margin: 0;
}

.product-card-in-list__info__name {
  color: var(--text-color);
  /*#040b14*/
  font-size: 16px;
  line-height: 22px;
  margin-bottom: 6px;
}

.product-card-in-list__info__bundleInfo {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-bottom: 6px;
}

.product-card-in-list__info__bundleInfo span {
  margin: 0 2px;
}

.product-card-in-list__info__bundleInfo .color-circle {
  width: 20px;
  height: 20px;
  display: block;
  padding: 0;
  /* border: 1px solid grey; */
  border: 3px solid #fff;
  outline: 1px solid grey;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 4px;
}

.product-card-in-list__info__quantity {
  height: 24px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  left: 115px;
  bottom: 8px;
  margin-top: 8px;
  z-index: 117;
}

.product-card-in-list__info__quantity button {
  width: 36px;
  min-width: 36px;
  height: 36px;
  min-height: 36px;
  border: 0.2px solid var(--btns-border-color);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
  z-index: 118;
}

.product-card-in-list__info__quantity .amount {
  width: 40px;
  height: 36px;
  min-height: 36px;
  border: none;
  text-align: center;
  vertical-align: middle;
  line-height: 24px;
  z-index: 118;
  margin: 0 4px;
}

.product-card-in-list__info__quantity .amount::-webkit-outer-spin-button,
.product-card-in-list__info__quantity .amount::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.product-card-in-list__info__quantity .amount[type="number"] {
  appearance: textfield;
}

.product-card-in-list .product-card-like-btn {
  width: 42px;
  height: 42px;
}

.product-card-actions svg {
  width: 18px;
  height: 18px;
}

.product-card-in-list__actions {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-around;
  position: absolute;
  right: 0;
  top: 0;
  padding: 0 7px 0 0;
  z-index: 117;
}

.product-card-in-list__action {
  height: 42px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  margin: 6px 0;
  background-color: var(--btns-bg);
  color: var(--text-color);
}

.product-card-in-list__action svg {
  height: 20px;
  width: 20px;
  flex-shrink: 0;
  margin-right: 6px;
}

.product-card-in-list__action span {
  white-space: nowrap;
}
</style>
