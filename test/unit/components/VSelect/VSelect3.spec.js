import { test } from '@/test'
import VSelect from '@/components/VSelect/VSelect'
import VChip from '@/components/VChip'

test('VSelect', ({ mount, compileToFunctions }) => {
  const app = document.createElement('div')
  app.setAttribute('data-app', true)
  document.body.appendChild(app)

  // Inspired by https://github.com/vuetifyjs/vuetify/pull/1425 - Thanks @kevmo314
  it('should open the select when focused and enter, space, up or down are pressed', async () => {
    const wrapper = mount(VSelect)

    wrapper.trigger('mouseup')

    expect(wrapper.vm.isMenuActive).toBe(false)

    wrapper.setProps({ box: true })
    wrapper.first('.v-input__slot').trigger('mouseup')

    expect(wrapper.vm.isMenuActive).toBe(true)

    wrapper.setData({ isMenuActive: false })
    wrapper.setProps({ box: false, solo: true })
    wrapper.first('.v-input__slot').trigger('mouseup')

    expect(wrapper.vm.isMenuActive).toBe(true)

    wrapper.setData({ isMenuActive: false })
    wrapper.setProps({ solo: false, soloInverted: true })
    wrapper.first('.v-input__slot').trigger('mouseup')

    expect(wrapper.vm.isMenuActive).toBe(true)

    wrapper.setData({ isMenuActive: false })
    wrapper.setProps({ soloInverted: false, outline: true })
    wrapper.first('.v-input__slot').trigger('mouseup')

    expect(wrapper.vm.isMenuActive).toBe(true)
  })

  it('should return full items if using auto prop', () => {
    const wrapper = mount(VSelect, {
      propsData: {
        items: [...Array(100).keys()]
      }
    })

    expect(wrapper.vm.virtualizedItems.length).toBe(20)

    wrapper.setProps({ auto: true })

    expect(wrapper.vm.virtualizedItems.length).toBe(100)
  })

  it('should fallback to using text as value if none present', () => {
    const wrapper = mount(VSelect, {
      propsData: {
        items: [{
          text: 'foo'
        }]
      }
    })

    expect(wrapper.vm.getValue(wrapper.vm.items[0])).toBe('foo')
  })

  it('should accept arrays as values', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        items: [
          { text: 'Foo', value: ['bar'] }
        ]
      }
    })

    const input = jest.fn()
    wrapper.vm.$on('input', input)

    wrapper.vm.selectItem(wrapper.vm.items[0])

    await wrapper.vm.$nextTick()

    expect(input).toBeCalledWith(['bar'])
    expect(wrapper.vm.selectedItems).toEqual([
      { text: 'Foo', value: ['bar'] }
    ])
  })

  // https://github.com/vuetifyjs/vuetify/issues/4359
  // Vue modifies the `on` property of the
  // computed `listData` — easiest way to fix
  it('should select value when using a scoped slot', async () => {
    const wrapper = mount(VSelect, {
      propsData: {
        items: ['foo', 'bar']
      },
      slots: {
        'no-data': [() => ({
          render: h => h('div', 'No Data')
        })]
      }
    })

    // Will be undefined if fails
    expect(wrapper.vm.listData.on).toBeTruthy()
  })
})
