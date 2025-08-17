export const AllOption = { label: 'All', value: null };

export const TypeImage = { label: 'Image', value: 'IMAGE' };
export const TypeGeneral = { label: 'General', value: 'GENERAL' };
export const TypeEvent = { label: 'Event', value: 'EVENT' };
export const TypeOptions = [TypeGeneral, TypeImage, TypeEvent];

export const SubTypeSingle = { label: 'Single', value: 'SINGLE' };
export const SubTypePanorama = { label: 'Panorama', value: 'PANORAMA' };
export const SubTypeOptions = [SubTypeSingle, SubTypePanorama];

export const TypeSettopBox = { label: 'Set-top Box (S)', value: 'Set-top Box' };
export const TypeDisplay = { label: 'Display (T)', value: 'Display' };
export const TypeDistributor = {
  label: 'Distributor (D)',
  value: 'Distributor',
};
export const TypeShelf = { label: 'Shelf (H)', value: 'Shelf' };
export const TypeDeviceOptions = [
  TypeDisplay,
  TypeShelf,
  TypeSettopBox,
  TypeDistributor,
];

export const STATUS_ENABLE = { label: 'Published', value: 'ENABLE' };
export const STATUS_UNENABLE = { label: 'Hidden', value: 'UNENABLE' };
export const StatusOptions = [STATUS_ENABLE, STATUS_UNENABLE];

export const STATUS_ACTIVE = { label: 'Active', value: 'ACTIVE' };
export const STATUS_INACTIVE = { label: 'Inactive', value: 'INACTIVE' };
export const StatusActiveOptions = [STATUS_ACTIVE, STATUS_INACTIVE];

export const STATUS_PUBLISHED = { label: 'Published', value: 'PUBLISHED' };
export const STATUS_HIDE = { label: 'Hide', value: 'HIDE' };
export const StatusPublishedOptions = [STATUS_PUBLISHED, STATUS_HIDE];

export const STATUS_PUBLIC = { label: 'Public', value: 'PUBLIC' };
export const STATUS_HIDDEN = { label: 'Hidden', value: 'HIDDEN' };
export const StatusPublicOptions = [STATUS_PUBLIC, STATUS_HIDDEN];
export const StatusPublishedHiddenOptions = [STATUS_PUBLISHED, STATUS_HIDDEN];

export const STATUS_USED = { label: 'Used', value: 'USED' };
export const STATUS_USING = { label: 'In Use', value: 'USING', color: 'green' };
export const STATUS_UNUSED = {
  label: 'Not Used',
  value: 'UNUSED',
  color: 'default',
};
export const STATUS_EXPIRED = {
  label: 'Usage Period Expried',
  value: 'EXPIRED',
  color: 'geekblue',
};
export const STATUS_VALIDITY_EXPIRED = {
  label: 'Validity Period Expired',
  value: 'VALIDITY_EXPIRED',
  color: 'red',
};
export const StatusUsedOptions = [STATUS_USED, STATUS_UNUSED];
export const StatusUsingOptions = [
  STATUS_USING,
  STATUS_UNUSED,
  STATUS_EXPIRED,
  STATUS_VALIDITY_EXPIRED,
];

export const GradeOptions = [
  {
    label: 'Subscriber',
    value: 'SUBSCRIBER',
  },
  {
    label: 'Non Subscriber',
    value: 'NON_SUBSCRIBER',
  },
  { label: 'Coupon User', value: 'TRIAL_COUPON' },
];

export const ADMINISTRATION_LOG = {
  label: 'Administration Log',
  value: 'Administration Log',
};

export const RoleAdmin = {
  label: 'Admin',
  value: 'ADMIN',
};

export const RoleSuperAdmin = {
  label: 'Super Admin',
  value: 'SUPERADMIN',
};

export const RoleOptions = [RoleAdmin, RoleSuperAdmin];

export const configErr = {
  message: 'Action failed, please try again!',
  // description: 'Action failed, please try again!',
};

export const configSuccess = {
  message: 'Action successfully!',
  // description: 'Action successfully!',
};

export const messRequired = 'This field is required!';

export const messInvalid = 'This field is invalid!';

export const messPassword =
  'Password must be at least 6 characters long and include uppercase, lowercase, a number, and a special character';

export const messPhone = 'Phone number must have 10 digits';

export const messPdf = 'Can only upload pdf files';

export const messImage = 'Can only upload image files';

export const messVideo = 'Can only upload video files';

export const messFileSize = 'Only files not exceeding ';

export const messFileMaxCount = 'Cannot upload more than ';

export const messOrientation =
  'The uploaded file has an incorrect orientation. Please rotate it to the correct format and try again';

export const messLength = 'The characters of this field should be only';

export const messChar = 'This field must is characters';

export const wishlistLink = {
  key: 'whishlist',
  label: 'Wishlist link',
  url: import.meta.env.VITE_WHISHLIST_URL,
};
export const panaromaLink = {
  key: 'panaroma',
  label: 'Panorama settings link',
  url: import.meta.env.VITE_PANORAMA_URL,
};
export const playlistLink = {
  key: 'playlist',
  label: 'Playback list link',
  url: import.meta.env.VITE_PLAYLIST_URL,
};
export const userLinkArr = [
  wishlistLink,
  panaromaLink,
  playlistLink,
  {
    key: 'equipment',
    label: 'Equipment information',
    url: import.meta.env.VITE_EQUIPMENT_URL,
  },
  {
    key: 'coupon',
    label: 'Coupon information',
    url: import.meta.env.VITE_COUPON_URL,
  },
  { key: 'qa', label: 'Q&A information', url: import.meta.env.VITE_QA_URL },
];

export const enumLogHistory = {
  updated_at: 'Date and Time',
  coupon_code: 'Coupon Code',
  period_month: 'Period (Month)',
  used_at: 'Isused Date',
  expired_at: 'Expired Date',
  usage_status: 'Status',
  operator: 'Operator',
  membership: 'Username',
  remarks: 'Remarks',
  created_at: 'Date and Time',
  manufacturer_name: 'Manufacturer Name',
  productionCategory: 'Category',
  price: 'Price',
  specification: 'Specification',
  status: 'Status',
  password: 'Password Updated',
  role: 'Role',
  product_cate_name: 'Product Category Name',
  content_cate_name: 'Content Category Name',
  name: 'Name',
};

export const errorCode = {
  'AUTH-400-00017': 'This account is inactive',
  'COUPON-500-00004': 'Cannot delete the coupon while it is in active status',
  'EQUIPMENT-400-00015': 'Cannot upgrade equipments offline',
  'PRODUCTION_CATEGORY-409-00006':
    'This unique code already exists. Please enter a different one',
  'PRODUCTION_CATEGORY-400-00007':
    'The unique code must not exceed 2 characters',
};

export const EquipmentSortOptions = [
  {
    value: 'registration_date',
    label: 'Latest Registration Date',
    direction: 'DESC',
  },
  { value: 'index', label: 'Latest Unique Code', direction: 'DESC' },
  {
    value: 'installation_date',
    label: 'Latest Installation Date',
    direction: 'DESC',
  },
  {
    value: 'production_date',
    label: 'Latest Production Date',
    direction: 'DESC',
  },
  { value: 'version_code', label: 'Lowest Software Version', direction: 'ASC' },
];

export const UserSortOptions = [
  {
    value: 'subcription_date',
    label: 'Latest Subscription Start Date',
    direction: 'DESC',
  },
  {
    value: 'registration_date',
    label: 'Latest Membership Registration Date',
    direction: 'DESC',
  },
  {
    value: 'total_subscription_period',
    label: 'Longest Subscription Period',
    direction: 'DESC',
  },
];

export const ContentSortOptions = [
  {
    value: 'registration_date',
    label: 'Latest Registration Date',
    direction: 'DESC',
  },
  {
    value: 'production_date',
    label: 'Latest Production Date',
    direction: 'DESC',
  },
  {
    value: 'wishlist_count',
    label: 'Most Whishlist',
    direction: 'DESC',
  },
  {
    value: 'download_count',
    label: 'Most Download',
    direction: 'DESC',
  },
];

export const SettlementSortOptions = [
  {
    value: 'created_at',
    label: 'Member ID',
    direction: 'DESC',
  },
  {
    value: 'subscription_date',
    label: 'Scheduled Settlement Date',
    direction: 'DESC',
  },
];

export const WHITESPACE_ERROR_MESSAGE = "Invalid format - contains leading or trailing whitespace";
