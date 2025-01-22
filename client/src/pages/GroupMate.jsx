import React from 'react'

function GroupMate() {
  return (
    <div className="min-h-screen flex bg-gray-100">
    <div className="flex-1">
        <div className="bg-white shadow-md rounded-md max-w-6xl min-h-full w-full mx-60 p-8">
            <h1 className="text-2xl font-semibold">GroupMate</h1>
            <p className="text-gray-500">Find your group mates here</p>
            
            {/* Filters */}
            <div className="mb-6 flex justify-between items-center content-center gap-4">
                {/* Create GroupMate Form */}
                {role === "Student" && <CreateGroupMate onCreate={handleCreateGroupMate} />}

                {/* GroupMate Type Filter */}
                <div>
                    <label className="block font-semibold text-gray-700">
                        Filter by GroupMate Type:
                    </label>
                    <select
                        value={groupMateTypeFilter}
                        onChange={(e) => setGroupMateTypeFilter(e.target.value)}
                        className="w-full mt-2 p-2 border border-gray-300 rounded-md"
                    >
                        {groupMateTypes.map((type, index) => (
                            <option key={index} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search by GroupMate Title */}
                <div>
                    <label className="block font-semibold text-gray-700">
                        Search by GroupMate Title:
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Search for a group mate"
                        />
                    </div>
                </div>
            </div>
            
            {/* GroupMates */}
            <div className="grid grid-cols-1 gap-4">
                {groupMates.map((groupMate, index) => (
                    <GroupMateCard key={index} groupMate={groupMate} />
                ))}
            </div>
        </div>
    </div>
    </div>
  )
}

export default GroupMate