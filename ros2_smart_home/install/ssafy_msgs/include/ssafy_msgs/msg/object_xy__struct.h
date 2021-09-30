// generated from rosidl_generator_c/resource/idl__struct.h.em
// with input from ssafy_msgs:msg\ObjectXY.idl
// generated code does not contain a copyright notice

#ifndef SSAFY_MSGS__MSG__OBJECT_XY__STRUCT_H_
#define SSAFY_MSGS__MSG__OBJECT_XY__STRUCT_H_

#ifdef __cplusplus
extern "C"
{
#endif

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>


// Constants defined in the message

// Struct defined in msg/ObjectXY in the package ssafy_msgs.
typedef struct ssafy_msgs__msg__ObjectXY
{
  float x_distance;
  float y_distance;
} ssafy_msgs__msg__ObjectXY;

// Struct for a sequence of ssafy_msgs__msg__ObjectXY.
typedef struct ssafy_msgs__msg__ObjectXY__Sequence
{
  ssafy_msgs__msg__ObjectXY * data;
  /// The number of valid items in data
  size_t size;
  /// The number of allocated items in data
  size_t capacity;
} ssafy_msgs__msg__ObjectXY__Sequence;

#ifdef __cplusplus
}
#endif

#endif  // SSAFY_MSGS__MSG__OBJECT_XY__STRUCT_H_
