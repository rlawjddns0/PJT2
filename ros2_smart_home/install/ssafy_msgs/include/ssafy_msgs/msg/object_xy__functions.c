// generated from rosidl_generator_c/resource/idl__functions.c.em
// with input from ssafy_msgs:msg\ObjectXY.idl
// generated code does not contain a copyright notice
#include "ssafy_msgs/msg/object_xy__functions.h"

#include <assert.h>
#include <stdbool.h>
#include <stdlib.h>
#include <string.h>


bool
ssafy_msgs__msg__ObjectXY__init(ssafy_msgs__msg__ObjectXY * msg)
{
  if (!msg) {
    return false;
  }
  // x_distance
  // y_distance
  return true;
}

void
ssafy_msgs__msg__ObjectXY__fini(ssafy_msgs__msg__ObjectXY * msg)
{
  if (!msg) {
    return;
  }
  // x_distance
  // y_distance
}

ssafy_msgs__msg__ObjectXY *
ssafy_msgs__msg__ObjectXY__create()
{
  ssafy_msgs__msg__ObjectXY * msg = (ssafy_msgs__msg__ObjectXY *)malloc(sizeof(ssafy_msgs__msg__ObjectXY));
  if (!msg) {
    return NULL;
  }
  memset(msg, 0, sizeof(ssafy_msgs__msg__ObjectXY));
  bool success = ssafy_msgs__msg__ObjectXY__init(msg);
  if (!success) {
    free(msg);
    return NULL;
  }
  return msg;
}

void
ssafy_msgs__msg__ObjectXY__destroy(ssafy_msgs__msg__ObjectXY * msg)
{
  if (msg) {
    ssafy_msgs__msg__ObjectXY__fini(msg);
  }
  free(msg);
}


bool
ssafy_msgs__msg__ObjectXY__Sequence__init(ssafy_msgs__msg__ObjectXY__Sequence * array, size_t size)
{
  if (!array) {
    return false;
  }
  ssafy_msgs__msg__ObjectXY * data = NULL;
  if (size) {
    data = (ssafy_msgs__msg__ObjectXY *)calloc(size, sizeof(ssafy_msgs__msg__ObjectXY));
    if (!data) {
      return false;
    }
    // initialize all array elements
    size_t i;
    for (i = 0; i < size; ++i) {
      bool success = ssafy_msgs__msg__ObjectXY__init(&data[i]);
      if (!success) {
        break;
      }
    }
    if (i < size) {
      // if initialization failed finalize the already initialized array elements
      for (; i > 0; --i) {
        ssafy_msgs__msg__ObjectXY__fini(&data[i - 1]);
      }
      free(data);
      return false;
    }
  }
  array->data = data;
  array->size = size;
  array->capacity = size;
  return true;
}

void
ssafy_msgs__msg__ObjectXY__Sequence__fini(ssafy_msgs__msg__ObjectXY__Sequence * array)
{
  if (!array) {
    return;
  }
  if (array->data) {
    // ensure that data and capacity values are consistent
    assert(array->capacity > 0);
    // finalize all array elements
    for (size_t i = 0; i < array->capacity; ++i) {
      ssafy_msgs__msg__ObjectXY__fini(&array->data[i]);
    }
    free(array->data);
    array->data = NULL;
    array->size = 0;
    array->capacity = 0;
  } else {
    // ensure that data, size, and capacity values are consistent
    assert(0 == array->size);
    assert(0 == array->capacity);
  }
}

ssafy_msgs__msg__ObjectXY__Sequence *
ssafy_msgs__msg__ObjectXY__Sequence__create(size_t size)
{
  ssafy_msgs__msg__ObjectXY__Sequence * array = (ssafy_msgs__msg__ObjectXY__Sequence *)malloc(sizeof(ssafy_msgs__msg__ObjectXY__Sequence));
  if (!array) {
    return NULL;
  }
  bool success = ssafy_msgs__msg__ObjectXY__Sequence__init(array, size);
  if (!success) {
    free(array);
    return NULL;
  }
  return array;
}

void
ssafy_msgs__msg__ObjectXY__Sequence__destroy(ssafy_msgs__msg__ObjectXY__Sequence * array)
{
  if (array) {
    ssafy_msgs__msg__ObjectXY__Sequence__fini(array);
  }
  free(array);
}
