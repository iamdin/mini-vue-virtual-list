import {
  ref,
  computed,
  PropType,
  onMounted,
  onUpdated,
  nextTick,
  cloneVNode,
  defineComponent,
  CSSProperties,
  reactive,
} from 'vue'
import { binarySearchR } from './util'

type SizeAndPosition = {
  idx: number
  height: number
  top: number
  bottom: number
}

const WRAPPER_STYLE: CSSProperties = {
  position: 'relative',
  height: '100%',
  width: '100%',
  overflow: 'auto',
}

const INNER_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
}

const CONTENT_STYLE: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
}

export default defineComponent({
  name: 'VirtualList',
  props: {
    estimateItemSize: { type: Number, required: true },
    listData: Object as PropType<any[]>,
    style: Object as PropType<CSSProperties>,
  },
  setup(props, { slots }) {
    const wrapperRef = ref<HTMLDivElement | null>(null)
    const innerRef = ref<HTMLDivElement | null>(null)
    const contentRef = ref<HTMLDivElement | null>(null)
    const sizeAndPosition = reactive<SizeAndPosition[]>([])
    const clientHeight = ref()
    const [startIdx, endIdx] = [ref(0), ref(0)]
    const scrollHeight = computed(
      () => sizeAndPosition[sizeAndPosition.length - 1]?.bottom ?? 0
    )
    const _listData = computed(() =>
      props.listData.map((item, idx) => [item, idx])
    )
    const visibleData = computed(() =>
      _listData.value.slice(startIdx.value, endIdx.value)
    )
    const visibleCount = computed(() =>
      Math.ceil(clientHeight.value / props.estimateItemSize)
    )
    const startOffset = computed(() =>
      startIdx.value > 0 ? sizeAndPosition[startIdx.value].top : 0
    )

    function initSizeAndPosition() {
      props.listData.forEach((_, idx) =>
        sizeAndPosition.push({
          idx,
          height: props.estimateItemSize,
          top: idx * props.estimateItemSize,
          bottom: (idx + 1) * props.estimateItemSize,
        })
      )
    }

    function updateSizeAndPosition() {
      const itemNodes = contentRef.value?.children
      Array.from(itemNodes).forEach((itemNode) => {
        const { height } = itemNode.getBoundingClientRect()
        const idx = +itemNode.getAttribute('_v_idx')
        const oldHeight = sizeAndPosition[idx].height
        const diff = oldHeight - height
        console.log('%c %d', 'color: #f00;font-size:19px', diff)

        if (diff) {
          sizeAndPosition[idx].bottom -= diff
          sizeAndPosition[idx].height = height
          for (let i = idx + 1; i < sizeAndPosition.length; ++i) {
            sizeAndPosition[i].top = sizeAndPosition[i - 1].bottom
            sizeAndPosition[i].bottom -= diff
          }
        }
      })
    }

    function calcStartIdx(scrollTop = 0) {
      return binarySearchR(
        sizeAndPosition,
        (idx) => sizeAndPosition[idx].top <= scrollTop
      )
    }

    function handleScroll() {
      const scrollTop = wrapperRef.value?.scrollTop || 0
      startIdx.value = calcStartIdx(scrollTop)
      endIdx.value = startIdx.value + visibleCount.value
    }

    onMounted(() => {
      initSizeAndPosition()
      clientHeight.value = wrapperRef.value!.clientHeight
      startIdx.value = 0
      endIdx.value = startIdx.value + visibleCount.value
    })

    onUpdated(() => {
      nextTick(() => {
        updateSizeAndPosition()
      })
    })

    return () => {
      const wrapperStyle = {
        ...WRAPPER_STYLE,
        ...(props.style as Object),
      }
      const innerStyle = {
        ...INNER_STYLE,
        height: `${scrollHeight.value}px`,
      }

      const contentStyle: CSSProperties = {
        ...CONTENT_STYLE,
        transform: `translate3d(0, ${startOffset.value}px, 0)`,
      }
      const renderItem = () => {
        return visibleData.value.map(([item, idx]) => (
          <div _v_idx={idx}>{slots.default?.(item)?.[0]}</div>
        ))
      }

      return (
        <div ref={wrapperRef} style={wrapperStyle} onScroll={handleScroll}>
          <div ref={innerRef} class="inner" style={innerStyle}></div>
          <div ref={contentRef} style={contentStyle}>
            {renderItem()}
          </div>
        </div>
      )
    }
  },
})
