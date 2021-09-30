

/*
WARNING: THIS FILE IS AUTO-GENERATED. DO NOT MODIFY.

This file was generated from ObjectXY_.idl using "rtiddsgen".
The rtiddsgen tool is part of the RTI Connext distribution.
For more information, type 'rtiddsgen -help' at a command shell
or consult the RTI Connext manual.
*/

#ifndef ObjectXY__923788286_h
#define ObjectXY__923788286_h

#ifndef NDDS_STANDALONE_TYPE
#ifndef ndds_cpp_h
#include "ndds/ndds_cpp.h"
#endif
#else
#include "ndds_standalone_type.h"
#endif

namespace ssafy_msgs {
    namespace msg {
        namespace dds_ {

            extern const char *ObjectXY_TYPENAME;

            struct ObjectXY_Seq;
            #ifndef NDDS_STANDALONE_TYPE
            class ObjectXY_TypeSupport;
            class ObjectXY_DataWriter;
            class ObjectXY_DataReader;
            #endif

            class ObjectXY_ 
            {
              public:
                typedef struct ObjectXY_Seq Seq;
                #ifndef NDDS_STANDALONE_TYPE
                typedef ObjectXY_TypeSupport TypeSupport;
                typedef ObjectXY_DataWriter DataWriter;
                typedef ObjectXY_DataReader DataReader;
                #endif

                DDS_Float   x_distance_ ;
                DDS_Float   y_distance_ ;

            };
            #if (defined(RTI_WIN32) || defined (RTI_WINCE)) && defined(NDDS_USER_DLL_EXPORT_ssafy_msgs)
            /* If the code is building on Windows, start exporting symbols.
            */
            #undef NDDSUSERDllExport
            #define NDDSUSERDllExport __declspec(dllexport)
            #endif

            NDDSUSERDllExport DDS_TypeCode* ObjectXY__get_typecode(void); /* Type code */

            DDS_SEQUENCE(ObjectXY_Seq, ObjectXY_);

            NDDSUSERDllExport
            RTIBool ObjectXY__initialize(
                ObjectXY_* self);

            NDDSUSERDllExport
            RTIBool ObjectXY__initialize_ex(
                ObjectXY_* self,RTIBool allocatePointers,RTIBool allocateMemory);

            NDDSUSERDllExport
            RTIBool ObjectXY__initialize_w_params(
                ObjectXY_* self,
                const struct DDS_TypeAllocationParams_t * allocParams);  

            NDDSUSERDllExport
            void ObjectXY__finalize(
                ObjectXY_* self);

            NDDSUSERDllExport
            void ObjectXY__finalize_ex(
                ObjectXY_* self,RTIBool deletePointers);

            NDDSUSERDllExport
            void ObjectXY__finalize_w_params(
                ObjectXY_* self,
                const struct DDS_TypeDeallocationParams_t * deallocParams);

            NDDSUSERDllExport
            void ObjectXY__finalize_optional_members(
                ObjectXY_* self, RTIBool deletePointers);  

            NDDSUSERDllExport
            RTIBool ObjectXY__copy(
                ObjectXY_* dst,
                const ObjectXY_* src);

            #if (defined(RTI_WIN32) || defined (RTI_WINCE)) && defined(NDDS_USER_DLL_EXPORT_ssafy_msgs)
            /* If the code is building on Windows, stop exporting symbols.
            */
            #undef NDDSUSERDllExport
            #define NDDSUSERDllExport
            #endif
        } /* namespace dds_  */
    } /* namespace msg  */
} /* namespace ssafy_msgs  */

#endif /* ObjectXY_ */

