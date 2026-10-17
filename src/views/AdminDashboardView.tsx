import React, { useEffect, useState } from 'react';
import { tajService } from '../services/tajService';
import { TajGroup, TajProfile, UserRole } from '../types/database';

interface AdminDashboardViewProps {
  onShowToast: (msg: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'groups' | 'users' | 'summary'>('groups');
  const [groups, setGroups] = useState<TajGroup[]>([]);
  const [profiles, setProfiles] = useState<TajProfile[]>([]);
  const [supervisors, setSupervisors] = useState<TajProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userSearch, setUserSearch] = useState<string>('');

  // Group Modal state
  const [showGroupModal, setShowGroupModal] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<TajGroup | null>(null);
  const [groupName, setGroupName] = useState<string>('');
  const [groupCategory, setGroupCategory] = useState<string>('حلقة مكثف إتقان');
  const [groupSessionTime, setGroupSessionTime] = useState<string>('فترة الفجر (٥:٣٠ ص - ٧:٠٠ ص)');
  const [groupLocation, setGroupLocation] = useState<string>('قاعة الإمام نافع');
  const [groupSupervisorId, setGroupSupervisorId] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    const [fetchedGroups, fetchedProfiles, fetchedSupervisors] = await Promise.all([
      tajService.getGroups(),
      tajService.getAllProfiles(),
      tajService.getSupervisors(),
    ]);
    setGroups(fetchedGroups);
    setProfiles(fetchedProfiles);
    setSupervisors(fetchedSupervisors);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateGroupModal = () => {
    setEditingGroup(null);
    setGroupName('');
    setGroupCategory('حلقة مكثف إتقان');
    setGroupSessionTime('فترة الفجر (٥:٣٠ ص - ٧:٠٠ ص)');
    setGroupLocation('قاعة الإمام نافع');
    setGroupSupervisorId(supervisors[0]?.id || '');
    setShowGroupModal(true);
  };

  const openEditGroupModal = (group: TajGroup) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setGroupCategory(group.category || 'حلقة مكثف إتقان');
    setGroupSessionTime(group.session_time || 'فترة الفجر (٥:٣٠ ص - ٧:٠٠ ص)');
    setGroupLocation(group.location || 'قاعة الإمام نافع');
    setGroupSupervisorId(group.supervisor_id || '');
    setShowGroupModal(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    if (editingGroup) {
      const { error } = await tajService.updateGroup(editingGroup.id, {
        name: groupName.trim(),
        category: groupCategory,
        session_time: groupSessionTime,
        location: groupLocation,
        supervisor_id: groupSupervisorId || null,
      });
      if (error) {
        onShowToast(`خطأ في تعديل المجموعة: ${error.message}`);
      } else {
        onShowToast('تم تحديث بيانات الحلقة بنجاح');
        setShowGroupModal(false);
        loadData();
      }
    } else {
      const { error } = await tajService.createGroup({
        name: groupName.trim(),
        category: groupCategory,
        session_time: groupSessionTime,
        location: groupLocation,
        supervisor_id: groupSupervisorId || null,
      });
      if (error) {
        onShowToast(`خطأ في إنشاء المجموعة: ${error.message}`);
      } else {
        onShowToast('تم إنشاء حلقة جديدة بنجاح');
        setShowGroupModal(false);
        loadData();
      }
    }
  };

  const handleDeleteGroup = async (id: string, name: string) => {
    if (!window.confirm(`هل أنتِ متأكدة من رغبتك في حذف حلقة "${name}"؟`)) return;
    const { error } = await tajService.deleteGroup(id);
    if (error) {
      onShowToast(`خطأ: ${error.message}`);
    } else {
      onShowToast(`تم حذف حلقة "${name}"`);
      loadData();
    }
  };

  const handleRoleChange = async (profileId: string, newRole: UserRole, currentGroupId: string | null) => {
    const { error } = await tajService.updateUserRoleAndGroup(profileId, newRole, currentGroupId);
    if (error) {
      onShowToast(`خطأ في تغيير الدور: ${error.message}`);
    } else {
      onShowToast('تم تحديث دور المستخدم بنجاح');
      loadData();
    }
  };

  const handleGroupAssign = async (profileId: string, currentRole: UserRole, newGroupId: string) => {
    const { error } = await tajService.updateUserRoleAndGroup(
      profileId,
      currentRole,
      newGroupId === 'none' ? null : newGroupId
    );
    if (error) {
      onShowToast(`خطأ في تعيين الحلقة: ${error.message}`);
    } else {
      onShowToast('تم تعيين الحلقة بنجاح');
      loadData();
    }
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    (p.phone && p.phone.includes(userSearch))
  );

  const totalStudents = profiles.filter((p) => p.role === 'student').length;
  const totalSupervisors = profiles.filter((p) => p.role === 'supervisor').length;

  return (
    <div className="flex flex-col w-full pb-16 font-sans space-y-6" dir="rtl">
      {/* Top Banner */}
      <section className="p-6 rounded-3xl bg-white border border-[#bfc9c2]/30 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#004331] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-[26px] text-[#85f8c4]">
              admin_panel_settings
            </span>
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#0b1c30]">
                لوحة تحكم المديرة العامة
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#85f8c4] text-[#005137] text-xs font-bold">
                صلاحية كاملة (Admin)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#3f4944] mt-0.5">
              إدارة مجموعات الحلقات، تعيين المشرفات، توزيع الحافظات، ومتابعة الأداء العام.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#dce9ff] text-[#004331] font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-[#dce9ff] transition-all cursor-pointer"
        >
          <span className={`material-symbols-outlined text-[18px] ${loading ? 'animate-spin' : ''}`}>
            refresh
          </span>
          تحديث البيانات
        </button>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">إجمالي الحلقات:</span>
          <span className="font-serif text-2xl font-bold text-[#004331] mt-1 block">
            {groups.length}
          </span>
          <span className="text-[11px] text-[#005d3f]">حلقات معتمدة</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">المشرفات المعتمدات:</span>
          <span className="font-serif text-2xl font-bold text-[#775a19] mt-1 block">
            {totalSupervisors}
          </span>
          <span className="text-[11px] text-[#785a1a]">مشرفة ميدانية</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">الحافظات المسجلات:</span>
          <span className="font-serif text-2xl font-bold text-[#005d3f] mt-1 block">
            {totalStudents}
          </span>
          <span className="text-[11px] text-[#005137]">طالبة في المنظومة</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#bfc9c2]/30 shadow-2xs">
          <span className="text-xs text-[#3f4944] block">إجمالي الحسابات:</span>
          <span className="font-serif text-2xl font-bold text-[#0b1c30] mt-1 block">
            {profiles.length}
          </span>
          <span className="text-[11px] text-[#6f7974]">مستخدمة مسجلة</span>
        </div>
      </section>

      {/* Tabs Bar */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#bfc9c2]/30 shadow-2xs max-w-xl">
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'groups'
              ? 'bg-[#004331] text-white shadow-xs'
              : 'text-[#3f4944] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">groups</span>
          إدارة المجموعات ({groups.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#004331] text-white shadow-xs'
              : 'text-[#3f4944] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
          المستخدمين والأدوار ({profiles.length})
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-[#004331] text-white shadow-xs'
              : 'text-[#3f4944] hover:bg-[#eff4ff]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">analytics</span>
          ملخص الحلقات
        </button>
      </div>

      {/* TAB 1: GROUPS */}
      {activeTab === 'groups' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#bfc9c2]/30 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0b1c30]">
                قائمة حلقات التحفيظ (taj_groups)
              </h2>
              <span className="text-xs text-[#3f4944]">
                إنشاء وتعديل الحلقات وتعيين المشرفة المسؤولة وعدد الحافظات
              </span>
            </div>
            <button
              onClick={openCreateGroupModal}
              className="px-4 py-2.5 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#85f8c4]">
                add
              </span>
              إضافة حلقة جديدة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-5 rounded-2xl bg-[#eff4ff]/60 border border-[#dce9ff] flex flex-col justify-between hover:border-[#004331]/30 transition-all shadow-2xs space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-[#004331]">
                      {group.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-[10px] font-bold">
                      {group.category}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-[#3f4944]">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#775a19]">
                        person
                      </span>
                      <span>
                        المشرفة:{' '}
                        <strong className="text-[#0b1c30]">
                          {group.supervisor_name}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#005d3f]">
                        group
                      </span>
                      <span>
                        الحافظات المسجلات:{' '}
                        <strong className="text-[#005d3f]">
                          {group.students_count || 0} حافظة
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#6f7974]">
                        schedule
                      </span>
                      <span>{group.session_time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#dce9ff]">
                  <button
                    onClick={() => openEditGroupModal(group)}
                    className="p-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#004331] border border-[#bfc9c2]/30 transition-colors cursor-pointer"
                    title="تعديل الحلقة"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteGroup(group.id, group.name)}
                    className="p-2 rounded-xl bg-white hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#bfc9c2]/30 transition-colors cursor-pointer"
                    title="حذف الحلقة"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {groups.length === 0 && !loading && (
            <div className="text-center py-12 text-[#6f7974] space-y-2">
              <span className="material-symbols-outlined text-4xl text-[#bfc9c2]">
                folder_off
              </span>
              <p className="text-sm">لا توجد حلقات مضافة حتى الآن في قاعدة البيانات.</p>
              <button
                onClick={openCreateGroupModal}
                className="px-4 py-2 rounded-xl bg-[#004331] text-white text-xs font-bold"
              >
                إنشاء أول حلقة
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: USERS & ROLES */}
      {activeTab === 'users' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-[#bfc9c2]/30 pb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#0b1c30]">
                إدارة المستخدمين والأدوار (taj_profiles)
              </h2>
              <span className="text-xs text-[#3f4944]">
                تعيين وتعديل الأدوار (مديرة، مشرفة، طالبة) وتوزيع الطالبات على الحلقات
              </span>
            </div>

            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6f7974] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="بحث بالاسم..."
                className="w-full bg-[#eff4ff] pl-3 pr-9 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#dce9ff] focus:outline-none"
              />
            </div>
          </div>

          {/* Role assignment tip without service_role */}
          <div className="p-3.5 rounded-2xl bg-[#eff4ff] border border-[#dce9ff] text-xs text-[#004331] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#004331] text-[20px] shrink-0">
              lightbulb
            </span>
            <div>
              <strong className="block font-bold">تسجيل الحسابات بدون مفتاح service_role:</strong>
              تستطيع الحافظة أو المشرفة تسجيل حسابها ذاتياً بالبريد وكلمة المرور، وبمجرد تسجيلها ستظهر فوراً في هذا الجدول لتقوم المديرة بتعيين دورها (مشرفة أو طالبة) واختيار حلقتها بضغطة واحدة وبكل أمان.
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#eff4ff] text-[#3f4944] font-bold border-b border-[#bfc9c2]/30 select-none">
                  <th className="p-3">الاسم</th>
                  <th className="p-3">الدور الحالي</th>
                  <th className="p-3">الحلقة المخصصة</th>
                  <th className="p-3">المسار والمرتبة</th>
                  <th className="p-3">تاريخ التسجيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bfc9c2]/20">
                {filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-[#eff4ff]/30">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#004331] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0b1c30] text-xs sm:text-sm">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-[#6f7974]">{p.phone || 'بدون هاتف'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Dropdown */}
                    <td className="p-3">
                      <select
                        value={p.role}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole, p.group_id)}
                        className={`px-2.5 py-1 rounded-xl font-bold text-xs cursor-pointer focus:outline-none border ${
                          p.role === 'admin'
                            ? 'bg-[#85f8c4]/40 text-[#005137] border-[#85f8c4]'
                            : p.role === 'supervisor'
                            ? 'bg-[#fed488]/40 text-[#785a1a] border-[#fed488]'
                            : 'bg-[#eff4ff] text-[#004331] border-[#dce9ff]'
                        }`}
                      >
                        <option value="student">طالبة (Student)</option>
                        <option value="supervisor">مشرفة (Supervisor)</option>
                        <option value="admin">مديرة (Admin)</option>
                      </select>
                    </td>

                    {/* Group Dropdown */}
                    <td className="p-3">
                      <select
                        value={p.group_id || 'none'}
                        onChange={(e) => handleGroupAssign(p.id, p.role, e.target.value)}
                        className="px-2.5 py-1 rounded-xl bg-white text-xs font-semibold text-[#0b1c30] border border-[#bfc9c2]/40 cursor-pointer focus:outline-none max-w-[180px]"
                      >
                        <option value="none">-- غير محددة --</option>
                        {groups.map((g) => (
                          <option key={g.id} value={g.id}>
                            {g.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3">
                      <span className="text-[#3f4944]">
                        {p.track || 'ختمة الإجازة'} • {p.level || 'متقنة'}
                      </span>
                    </td>

                    <td className="p-3 text-[#6f7974]">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString('ar-SA') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: SUMMARY */}
      {activeTab === 'summary' && (
        <section className="bg-white rounded-3xl border border-[#bfc9c2]/30 shadow-2xs p-6 space-y-4">
          <div className="border-b border-[#bfc9c2]/30 pb-3">
            <h2 className="font-serif text-lg font-bold text-[#0b1c30]">
              ملخص إحصائي شامل لكل حلقة
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-[#eff4ff] text-[#3f4944] font-bold border-b border-[#bfc9c2]/30">
                  <th className="p-3">اسم الحلقة</th>
                  <th className="p-3">المشرفة المسؤولة</th>
                  <th className="p-3">فترة الانعقاد</th>
                  <th className="p-3">عدد الحافظات</th>
                  <th className="p-3">المقر</th>
                  <th className="p-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bfc9c2]/20">
                {groups.map((g) => (
                  <tr key={g.id} className="hover:bg-[#f8f9ff]">
                    <td className="p-3 font-bold text-[#004331]">{g.name}</td>
                    <td className="p-3 text-[#0b1c30] font-semibold">{g.supervisor_name}</td>
                    <td className="p-3 text-[#3f4944]">{g.session_time}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#85f8c4]/40 text-[#005137] font-bold">
                        {g.students_count || 0} طالبة
                      </span>
                    </td>
                    <td className="p-3 text-[#6f7974]">{g.location}</td>
                    <td className="p-3">
                      <span className="text-[#005d3f] font-bold">🟢 نشطة ومباشرة</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Modal: Create or Edit Group */}
      {showGroupModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004331]/60 backdrop-blur-xs"
          dir="rtl"
        >
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#bfc9c2]/30 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#eff4ff] px-6 py-4 border-b border-[#bfc9c2]/30 flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#0b1c30]">
                {editingGroup ? 'تعديل بيانات الحلقة' : 'إضافة حلقة تحفيظ جديدة'}
              </h3>
              <button
                onClick={() => setShowGroupModal(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-[#dce9ff] flex items-center justify-center text-[#0b1c30]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="p-6 space-y-4 text-xs sm:text-sm">
              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">اسم الحلقة:</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="مثال: حلقة الفردوس (مكثف إتقان)"
                  className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">تصنيف الحلقة:</label>
                <input
                  type="text"
                  value={groupCategory}
                  onChange={(e) => setGroupCategory(e.target.value)}
                  placeholder="مثال: إتقان وإجازة بالسند"
                  className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">المشرفة المسؤولة:</label>
                <select
                  value={groupSupervisorId}
                  onChange={(e) => setGroupSupervisorId(e.target.value)}
                  className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] font-bold border border-[#bfc9c2]/40 focus:outline-none cursor-pointer"
                >
                  <option value="">-- بدون مشرفة حالياً --</option>
                  {supervisors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">موعد الجلسة:</label>
                <input
                  type="text"
                  value={groupSessionTime}
                  onChange={(e) => setGroupSessionTime(e.target.value)}
                  placeholder="مثال: فترة الفجر (٥:٣٠ ص - ٧:٠٠ ص)"
                  className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#0b1c30] block">مكان / قاعة الانعقاد:</label>
                <input
                  type="text"
                  value={groupLocation}
                  onChange={(e) => setGroupLocation(e.target.value)}
                  placeholder="مثال: قاعة الإمام نافع"
                  className="w-full bg-[#f8f9ff] px-3 py-2 rounded-xl text-xs text-[#0b1c30] border border-[#bfc9c2]/40 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#bfc9c2]/30 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#eff4ff] text-[#3f4944] text-xs font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004331] hover:bg-[#0d5c46] text-white text-xs font-bold"
                >
                  {editingGroup ? 'حفظ التعديلات' : 'إنشاء الحلقة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
