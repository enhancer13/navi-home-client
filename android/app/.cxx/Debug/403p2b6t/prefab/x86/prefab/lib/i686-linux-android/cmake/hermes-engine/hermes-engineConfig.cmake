if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/enhancer/.gradle/caches/transforms-3/41519aa8fd529585266b472341bd0030/transformed/jetified-hermes-android-0.71.5-debug/prefab/modules/libhermes/libs/android.x86/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/enhancer/.gradle/caches/transforms-3/41519aa8fd529585266b472341bd0030/transformed/jetified-hermes-android-0.71.5-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

