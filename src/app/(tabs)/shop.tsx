import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import { ShopProvider } from '@/components/context/shop/ShopProvider'
import { useShopContext } from '@/components/context/shop/useShopContext'
import ScreenPageContainer from '@/components/ScreenPageContainer'
import { IotSensorBanner } from '@/components/shop/IotSensorBanner'
import { ShopCart } from '@/components/shop/ShopCart'
import { ShopHeader } from '@/components/shop/ShopHeader'
import { ShopOrderHistory } from '@/components/shop/ShopOrderHistory'
import { ShopProductSection } from '@/components/shop/ShopProductSection'
import { STORE_DATA } from '@/constants/store'

const ShopContent = () => {
  const { iotReading } = useShopContext()
  const [cartVisible, setCartVisible] = useState<boolean>(false)

  return (
    <ScreenPageContainer className='px-0 py-20'>
      <View className='px-4'>
        <ShopHeader onToggleCart={() => setCartVisible((v) => !v)} />
        {iotReading && <IotSensorBanner reading={iotReading} />}
        {cartVisible && <ShopCart onClose={() => setCartVisible(false)} />}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1'>
        <View className='px-4'>
          <ShopOrderHistory />
          {STORE_DATA.map((section) => (
            <ShopProductSection
              key={section.category}
              category={section.category}
              items={section.items}
            />
          ))}
          <View className='h-6' />
        </View>
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default function Shop() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  )
}
