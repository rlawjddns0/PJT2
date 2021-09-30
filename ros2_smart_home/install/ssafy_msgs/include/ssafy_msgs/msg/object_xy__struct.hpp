// generated from rosidl_generator_cpp/resource/idl__struct.hpp.em
// with input from ssafy_msgs:msg\ObjectXY.idl
// generated code does not contain a copyright notice

#ifndef SSAFY_MSGS__MSG__OBJECT_XY__STRUCT_HPP_
#define SSAFY_MSGS__MSG__OBJECT_XY__STRUCT_HPP_

#include <rosidl_generator_cpp/bounded_vector.hpp>
#include <rosidl_generator_cpp/message_initialization.hpp>
#include <algorithm>
#include <array>
#include <memory>
#include <string>
#include <vector>


#ifndef _WIN32
# define DEPRECATED__ssafy_msgs__msg__ObjectXY __attribute__((deprecated))
#else
# define DEPRECATED__ssafy_msgs__msg__ObjectXY __declspec(deprecated)
#endif

namespace ssafy_msgs
{

namespace msg
{

// message struct
template<class ContainerAllocator>
struct ObjectXY_
{
  using Type = ObjectXY_<ContainerAllocator>;

  explicit ObjectXY_(rosidl_generator_cpp::MessageInitialization _init = rosidl_generator_cpp::MessageInitialization::ALL)
  {
    if (rosidl_generator_cpp::MessageInitialization::ALL == _init ||
      rosidl_generator_cpp::MessageInitialization::ZERO == _init)
    {
      this->x_distance = 0.0f;
      this->y_distance = 0.0f;
    }
  }

  explicit ObjectXY_(const ContainerAllocator & _alloc, rosidl_generator_cpp::MessageInitialization _init = rosidl_generator_cpp::MessageInitialization::ALL)
  {
    (void)_alloc;
    if (rosidl_generator_cpp::MessageInitialization::ALL == _init ||
      rosidl_generator_cpp::MessageInitialization::ZERO == _init)
    {
      this->x_distance = 0.0f;
      this->y_distance = 0.0f;
    }
  }

  // field types and members
  using _x_distance_type =
    float;
  _x_distance_type x_distance;
  using _y_distance_type =
    float;
  _y_distance_type y_distance;

  // setters for named parameter idiom
  Type & set__x_distance(
    const float & _arg)
  {
    this->x_distance = _arg;
    return *this;
  }
  Type & set__y_distance(
    const float & _arg)
  {
    this->y_distance = _arg;
    return *this;
  }

  // constant declarations

  // pointer types
  using RawPtr =
    ssafy_msgs::msg::ObjectXY_<ContainerAllocator> *;
  using ConstRawPtr =
    const ssafy_msgs::msg::ObjectXY_<ContainerAllocator> *;
  using SharedPtr =
    std::shared_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator>>;
  using ConstSharedPtr =
    std::shared_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator> const>;

  template<typename Deleter = std::default_delete<
      ssafy_msgs::msg::ObjectXY_<ContainerAllocator>>>
  using UniquePtrWithDeleter =
    std::unique_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator>, Deleter>;

  using UniquePtr = UniquePtrWithDeleter<>;

  template<typename Deleter = std::default_delete<
      ssafy_msgs::msg::ObjectXY_<ContainerAllocator>>>
  using ConstUniquePtrWithDeleter =
    std::unique_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator> const, Deleter>;
  using ConstUniquePtr = ConstUniquePtrWithDeleter<>;

  using WeakPtr =
    std::weak_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator>>;
  using ConstWeakPtr =
    std::weak_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator> const>;

  // pointer types similar to ROS 1, use SharedPtr / ConstSharedPtr instead
  // NOTE: Can't use 'using' here because GNU C++ can't parse attributes properly
  typedef DEPRECATED__ssafy_msgs__msg__ObjectXY
    std::shared_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator>>
    Ptr;
  typedef DEPRECATED__ssafy_msgs__msg__ObjectXY
    std::shared_ptr<ssafy_msgs::msg::ObjectXY_<ContainerAllocator> const>
    ConstPtr;

  // comparison operators
  bool operator==(const ObjectXY_ & other) const
  {
    if (this->x_distance != other.x_distance) {
      return false;
    }
    if (this->y_distance != other.y_distance) {
      return false;
    }
    return true;
  }
  bool operator!=(const ObjectXY_ & other) const
  {
    return !this->operator==(other);
  }
};  // struct ObjectXY_

// alias to use template instance with default allocator
using ObjectXY =
  ssafy_msgs::msg::ObjectXY_<std::allocator<void>>;

// constant definitions

}  // namespace msg

}  // namespace ssafy_msgs

#endif  // SSAFY_MSGS__MSG__OBJECT_XY__STRUCT_HPP_
