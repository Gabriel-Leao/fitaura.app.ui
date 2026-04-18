import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'

import ScreenPageContainer from '@/components/ScreenPageContainer'
import { STORE_DATA } from '@/constants/store'

const Shop = () => {
  return (
    <ScreenPageContainer className='py-20'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1 px-4 py-6'>
        {STORE_DATA.map((section) => (
          <View
            key={section.category}
            className='mb-8'>
            <Text className='mb-4 text-xl font-semibold text-white'>{section.category}</Text>

            <View className='flex-row flex-wrap justify-between'>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className='mb-4 w-[30%] items-center rounded-xl p-3'
                  activeOpacity={0.7}>
                  <Image
                    source={item.image}
                    className='mb-2 h-[150px] w-[100px] rounded-xl'
                  />

                  <Text className='text-center text-xs leading-tight text-white'>{item.name}</Text>

                  <Text className='mt-1 text-[10px] text-white opacity-70'>{item.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenPageContainer>
  )
}

export default Shop
